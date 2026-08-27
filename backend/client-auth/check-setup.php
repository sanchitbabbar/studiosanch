<?php
declare(strict_types=1);
// Read-only, SSH-only diagnostics. Never print configuration values or exception text.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0');
ini_set('log_errors', '0');
function report(string $name, string $status): void { echo $name . ': ' . $status . PHP_EOL; }
$path = __DIR__ . '/config.php';
report('Configuration file', is_file($path) && !is_link($path) ? 'present' : 'missing or symlink');
report('Configuration readable', is_readable($path) ? 'yes' : 'no');
report('Configuration writable', is_writable($path) ? 'yes' : 'no');
report('Private folder writable', is_writable(__DIR__) ? 'yes' : 'no');
report('PDO MySQL', extension_loaded('pdo_mysql') ? 'available' : 'unavailable');
try {
    $random = bin2hex(random_bytes(32));
    report('Secure random generation', 'OK');
    $hash = password_hash($random, PASSWORD_ARGON2ID);
    report('Argon2id hashing', password_verify($random, $hash) ? 'OK' : 'failed');
} catch (Throwable $e) { report('Cryptographic operations', 'failed'); }
$level = ob_get_level();
try {
    ob_start();
    $config = require $path;
    ob_end_clean();
    if (!is_array($config)) { report('Configuration format', 'must return an array'); exit(1); }
    foreach (['origin', 'dsn', 'user', 'password'] as $field) {
        $value = $config[$field] ?? null;
        $status = !is_string($value) || $value === '' ? 'missing or empty' : (str_contains($value, 'REPLACE_') || $value === 'YOUR_DATABASE_USER_PASSWORD' || $value === 'THE_NEW_PASSWORD' ? 'placeholder still present' : 'filled (value hidden)');
        report($field, $status);
    }
    $secret = $config['rate_secret'] ?? null;
    report('rate_secret', $secret === 'REPLACE_WITH_64_RANDOM_HEX_CHARACTERS' ? 'correct placeholder; ready to generate' : (is_string($secret) && preg_match('/^[a-f0-9]{64}$/D', $secret) ? 'already configured' : 'missing or unexpected value'));
    $dummy = $config['dummy_hash'] ?? null;
    report('dummy_hash', $dummy === 'REPLACE_WITH_ARGON2ID_HASH' ? 'correct placeholder; ready to generate' : (is_string($dummy) && (password_get_info($dummy)['algoName'] ?? '') === 'argon2id' ? 'already configured' : 'missing or unexpected value'));
} catch (Throwable $e) {
    while (ob_get_level() > $level) ob_end_clean();
    report('Configuration load', 'failed; contents hidden');
    exit(1);
}
