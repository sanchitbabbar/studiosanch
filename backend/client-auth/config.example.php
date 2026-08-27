<?php
// Copy to config.php ONLY in studio-sanch-private, outside public_html.
return [
 'origin' => 'https://studiosanch.com',
 'dsn' => 'mysql:host=localhost;dbname=REPLACE_DATABASE;charset=utf8mb4',
 'user' => 'REPLACE_DATABASE_USER',
 'password' => 'REPLACE_DATABASE_PASSWORD',
 // php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
 'rate_secret' => 'REPLACE_WITH_64_RANDOM_HEX_CHARACTERS',
 // php -r 'echo password_hash(bin2hex(random_bytes(32)), PASSWORD_ARGON2ID), PHP_EOL;'
 'dummy_hash' => 'REPLACE_WITH_ARGON2ID_HASH',
];
