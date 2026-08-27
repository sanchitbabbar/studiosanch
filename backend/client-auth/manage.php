<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';
// Run over an authenticated SSH connection. No public sign-up or admin endpoint.
$action = $argv[1] ?? '';
$username = strtolower(trim($argv[2] ?? ''));
if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,63}$/D', $username)) {
 fwrite(STDERR, "Usage: php manage.php invite username email booking-reference\n       php manage.php reissue username\n       php manage.php revoke username\n"); exit(1);
}
try {
 if ($action === 'revoke') {
  $row = client_query("UPDATE client_accounts SET status = 'disabled', session_version = session_version + 1, invitation_hash = NULL, invitation_expires = NULL WHERE username = ?", [$username]);
  if ($row->rowCount() !== 1) throw new RuntimeException('Account not found');
  fwrite(STDOUT, "Access revoked.\n");
 } elseif ($action === 'invite' || $action === 'reissue') {
  $token = bin2hex(random_bytes(32));
  $hash = hash('sha256', $token);
  if ($action === 'invite') {
   $email = $argv[3] ?? ''; $booking = trim($argv[4] ?? '');
   if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $booking === '' || strlen($booking) > 128) throw new RuntimeException('Valid email and confirmed booking reference required');
   client_query('INSERT INTO client_accounts (username, email, booking_reference, invitation_hash, invitation_expires) VALUES (?, ?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR))', [$username, $email, $booking, $hash]);
  } else {
   // Recovery is staff-mediated: verify the client against their original booking first.
   $row = client_query("UPDATE client_accounts SET invitation_hash = ?, invitation_expires = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR), session_version = session_version + 1, password_hash = NULL, status = 'invited' WHERE username = ? AND status <> 'disabled'", [$hash, $username]);
   if ($row->rowCount() !== 1) throw new RuntimeException('Account not available');
  }
  fwrite(STDOUT, "Send privately to the verified client; expires in 24 hours:\n" . client_config()['origin'] . '/client/#invite=' . $token . "\nUsername: " . $username . "\n");
 } else throw new RuntimeException('Unknown command');
} catch (Throwable $error) {
 fwrite(STDERR, "Operation failed. Verify command, account state and private configuration.\n"); exit(1);
}
