<?php
declare(strict_types=1);
function client_config(): array {
 static $config;
 if ($config === null) {
  $config = require __DIR__ . '/config.php';
  if (!defined('PASSWORD_ARGON2ID') || !preg_match('/^[a-f0-9]{64}$/D', $config['rate_secret'] ?? '') || !str_starts_with($config['dummy_hash'] ?? '', '$argon2id$') || !preg_match('#^https://[a-z0-9.-]+$#D', $config['origin'] ?? '')) throw new RuntimeException('Invalid configuration');
 }
 return $config;
}
function client_db(): PDO {
 static $db;
 if (!$db) {
  $c = client_config();
  $db = new PDO($c['dsn'], $c['user'], $c['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  $db->exec("SET time_zone = '+00:00'");
 }
 return $db;
}
function client_query(string $sql, array $values = []): PDOStatement {
 $statement = client_db()->prepare($sql); $statement->execute($values); return $statement;
}
function client_reply(int $status, array $data): never {
 http_response_code($status); echo json_encode($data, JSON_THROW_ON_ERROR); exit;
}
function client_session(): void {
 ini_set('session.use_strict_mode', '1');
 ini_set('session.use_only_cookies', '1');
 ini_set('session.use_trans_sid', '0');
 session_name('__Host-sanch_client');
 session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
 if (!session_start()) throw new RuntimeException('Session unavailable');
 $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}
function client_clear_session(): void {
 $_SESSION = []; session_regenerate_id(true); $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
function client_current(): ?array {
 if (empty($_SESSION['client_id'])) return null;
 if (time() - ($_SESSION['last_seen'] ?? 0) > 1800 || time() - ($_SESSION['signed_in'] ?? 0) > 28800) { client_clear_session(); return null; }
 $account = client_query('SELECT id, username, status, session_version FROM client_accounts WHERE id = ?', [$_SESSION['client_id']])->fetch();
 if (!$account || $account['status'] !== 'active' || (int)$account['session_version'] !== $_SESSION['version']) { client_clear_session(); return null; }
 $_SESSION['last_seen'] = time();
 return ['id' => (string)$account['id'], 'username' => $account['username']];
}
// Every future private endpoint must use this AND scope resource queries to account id.
function client_require_account(): array {
 $account = client_current();
 if (!$account) client_reply(401, ['error' => 'unauthorized']);
 return $account;
}
function client_limit(string $scope, string $identifier, int $maximum): void {
 $key = hash_hmac('sha256', $scope . ':' . $identifier, client_config()['rate_secret']);
 $db = client_db(); $db->beginTransaction();
 try {
  $now = time();
  client_query('INSERT INTO client_auth_limits (bucket, attempts, expires_at) VALUES (?, 0, ?) ON DUPLICATE KEY UPDATE bucket = bucket', [$key, $now + 900]);
  $row = client_query('SELECT attempts, expires_at FROM client_auth_limits WHERE bucket = ? FOR UPDATE', [$key])->fetch();
  $attempts = (int)$row['expires_at'] <= $now ? 0 : (int)$row['attempts'];
  $expires = (int)$row['expires_at'] <= $now ? $now + 900 : (int)$row['expires_at'];
  if ($attempts >= $maximum) { $db->commit(); header('Retry-After: ' . max(1, $expires - $now)); client_reply(429, ['error' => 'rate_limited']); }
  client_query('UPDATE client_auth_limits SET attempts = ?, expires_at = ? WHERE bucket = ?', [$attempts + 1, $expires, $key]);
  $db->commit();
 } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
}
function client_handle(): never {
 $config = client_config();
 // Do not trust user-supplied forwarded headers. HTTPS must terminate at the origin.
 if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') client_reply(400, ['error' => 'https_required']);
 client_session();
 $method = $_SERVER['REQUEST_METHOD'];
 if ($method === 'GET') client_reply(200, ['user' => client_current(), 'csrf' => $_SESSION['csrf']]);
 if ($method !== 'POST') { header('Allow: GET, POST'); client_reply(405, ['error' => 'method_not_allowed']); }
 if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $config['origin'] || !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) client_reply(403, ['error' => 'request_rejected']);
 if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') client_reply(415, ['error' => 'invalid_request']);
 $raw = file_get_contents('php://input', false, null, 0, 8193);
 if ($raw === false || strlen($raw) > 8192) client_reply(413, ['error' => 'invalid_request']);
 try { $data = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); } catch (JsonException $e) { client_reply(400, ['error' => 'invalid_request']); }
 if (!is_array($data)) client_reply(400, ['error' => 'invalid_request']);
 $action = $data['action'] ?? '';
 if ($action === 'logout') { client_clear_session(); client_reply(200, ['user' => null, 'csrf' => $_SESSION['csrf']]); }
 if (!in_array($action, ['login', 'activate'], true)) client_reply(400, ['error' => 'invalid_request']);
 client_limit('ip', $_SERVER['REMOTE_ADDR'] ?? 'unknown', 30);
 $username = is_string($data['username'] ?? null) ? strtolower(trim($data['username'])) : '';
 $password = is_string($data['password'] ?? null) ? $data['password'] : '';
 if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,63}$/D', $username) || strlen($password) > 1024 || $password === '') client_reply(401, ['error' => 'invalid_credentials']);
 client_limit('username', $username, 10);
 if ($action === 'activate') {
  $token = is_string($data['token'] ?? null) ? $data['token'] : '';
  if (!preg_match('/^[a-f0-9]{64}$/D', $token)) client_reply(400, ['error' => 'invalid_invitation']);
  if (!preg_match('/^.{15,128}$/usD', $password)) client_reply(400, ['error' => 'password_length']);
  $hash = password_hash($password, PASSWORD_ARGON2ID);
  // Atomic token consumption prevents replay, even with simultaneous requests.
  $updated = client_query("UPDATE client_accounts SET password_hash = ?, status = 'active', session_version = session_version + 1, invitation_hash = NULL, invitation_expires = NULL WHERE username = ? AND status <> 'disabled' AND invitation_hash = ? AND invitation_expires > UTC_TIMESTAMP()", [$hash, $username, hash('sha256', $token)]);
  if ($updated->rowCount() !== 1) client_reply(400, ['error' => 'invalid_invitation']);
  client_clear_session();
  client_reply(200, ['activated' => true, 'csrf' => $_SESSION['csrf']]);
 }
 $account = client_query('SELECT * FROM client_accounts WHERE username = ?', [$username])->fetch();
 $valid = password_verify($password, $account['password_hash'] ?? $config['dummy_hash']);
 if (!$valid || !$account || $account['status'] !== 'active') client_reply(401, ['error' => 'invalid_credentials']);
 client_clear_session();
 $_SESSION['client_id'] = (string)$account['id']; $_SESSION['version'] = (int)$account['session_version'];
 $_SESSION['signed_in'] = $_SESSION['last_seen'] = time();
 client_reply(200, ['user' => client_require_account(), 'csrf' => $_SESSION['csrf']]);
}
