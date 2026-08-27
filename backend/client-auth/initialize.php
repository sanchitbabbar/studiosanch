<?php
declare(strict_types=1);

// Run only over SSH, from outside public_html. Never prints configuration values.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0');
umask(0077);
$temporary = null;
try {
    $path = __DIR__ . '/config.php';
    if (is_link($path) || !is_file($path)) throw new RuntimeException('Configuration unavailable');
    $config = require $path;
    if (!is_array($config) || !defined('PASSWORD_ARGON2ID')) throw new RuntimeException('Runtime unavailable');
    foreach (['origin', 'dsn', 'user', 'password'] as $field) {
        if (!is_string($config[$field] ?? null) || $config[$field] === '' || str_contains($config[$field], 'REPLACE_')) throw new RuntimeException('Configuration incomplete');
    }
    $changed = false;
    if (($config['rate_secret'] ?? '') === 'REPLACE_WITH_64_RANDOM_HEX_CHARACTERS') {
        $config['rate_secret'] = bin2hex(random_bytes(32));
        $changed = true;
    }
    if (($config['dummy_hash'] ?? '') === 'REPLACE_WITH_ARGON2ID_HASH') {
        $config['dummy_hash'] = password_hash(bin2hex(random_bytes(32)), PASSWORD_ARGON2ID);
        $changed = true;
    }
    if (!is_string($config['rate_secret'] ?? null) || !preg_match('/^[a-f0-9]{64}$/D', $config['rate_secret'])
        || !is_string($config['dummy_hash'] ?? null) || (password_get_info($config['dummy_hash'])['algoName'] ?? '') !== 'argon2id') {
        throw new RuntimeException('Invalid existing security values');
    }
    if ($changed) {
        $contents = "<?php\ndeclare(strict_types=1);\nreturn " . var_export($config, true) . ";\n";
        $temporary = tempnam(__DIR__, '.config-');
        if ($temporary === false || dirname($temporary) !== __DIR__) throw new RuntimeException('Cannot create private file');
        if (!chmod($temporary, 0600) || file_put_contents($temporary, $contents, LOCK_EX) !== strlen($contents)) throw new RuntimeException('Cannot write private file');
        if (!rename($temporary, $path)) throw new RuntimeException('Cannot replace configuration');
        $temporary = null;
    }
    if (!chmod($path, 0600)) throw new RuntimeException('Cannot set private permissions');
    fwrite(STDOUT, $changed ? "Security values generated and saved. Database credentials preserved.\n" : "Security values already configured; no values changed.\n");
} catch (Throwable $error) {
    if (is_string($temporary) && is_file($temporary)) unlink($temporary);
    fwrite(STDERR, "Setup did not complete. Check PHP support, configuration placeholders and file permissions. No secret values were printed.\n");
    exit(1);
}
