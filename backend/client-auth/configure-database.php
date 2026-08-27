<?php
declare(strict_types=1);
// SSH-only setup. Password input is hidden and never passed in command arguments.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0');
ini_set('log_errors', '0');
umask(0077);
$terminal = null;
$temporary = null;
register_shutdown_function(function () use (&$terminal): void {
    if (is_string($terminal)) {
        exec('stty ' . escapeshellarg($terminal) . ' 2>/dev/null');
        fwrite(STDOUT, PHP_EOL);
    }
});
try {
    $database = $argv[1] ?? '';
    $username = $argv[2] ?? '';
    if (!preg_match('/^[a-zA-Z0-9_]{1,64}$/D', $database) || !preg_match('/^[a-zA-Z0-9_]{1,64}$/D', $username)) {
        throw new RuntimeException('Usage: php configure-database.php DATABASE_NAME DATABASE_USERNAME');
    }
    $path = __DIR__ . '/config.php';
    if (!is_file($path) || is_link($path)) throw new RuntimeException('Private config.php is missing or is a symlink.');
    $level = ob_get_level();
    try {
        ob_start();
        $config = require $path;
        $unexpected = ob_get_clean();
    } catch (Throwable $e) {
        while (ob_get_level() > $level) ob_end_clean();
        throw new RuntimeException('Configuration cannot be loaded. No values were displayed.');
    }
    if (!is_array($config) || $unexpected !== '') throw new RuntimeException('Configuration format needs repair. No changes made.');
    if (!function_exists('stream_isatty') || !stream_isatty(STDIN) || !function_exists('exec')) {
        throw new RuntimeException('Run this command in your interactive SSH Terminal.');
    }
    $output = [];
    exec('stty -g 2>/dev/null', $output, $status);
    if ($status !== 0 || empty($output[0])) throw new RuntimeException('Cannot safely hide password input.');
    $terminal = trim($output[0]);
    exec('stty -echo 2>/dev/null', $ignored, $status);
    if ($status !== 0) throw new RuntimeException('Cannot safely hide password input.');
    fwrite(STDOUT, 'Client Access DATABASE password (input hidden): ');
    $first = fgets(STDIN);
    fwrite(STDOUT, PHP_EOL . 'Enter the same database password again: ');
    $second = fgets(STDIN);
    exec('stty ' . escapeshellarg($terminal) . ' 2>/dev/null');
    $terminal = null;
    fwrite(STDOUT, PHP_EOL);
    if ($first === false || $second === false) throw new RuntimeException('Input cancelled; configuration unchanged.');
    $password = rtrim($first, "\r\n");
    $confirmation = rtrim($second, "\r\n");
    if ($password === '' || strlen($password) > 1024 || !hash_equals($password, $confirmation)) {
        throw new RuntimeException('Passwords were empty, too long, or did not match. Configuration unchanged.');
    }
    $config['dsn'] = 'mysql:host=localhost;dbname=' . $database . ';charset=utf8mb4';
    $config['user'] = $username;
    $config['password'] = $password;
    $contents = "<?php\ndeclare(strict_types=1);\nreturn " . var_export($config, true) . ";\n";
    $temporary = tempnam(__DIR__, '.config-');
    if ($temporary === false || realpath(dirname($temporary)) !== realpath(__DIR__)) throw new RuntimeException('Cannot create private configuration file.');
    if (!chmod($temporary, 0600) || file_put_contents($temporary, $contents, LOCK_EX) !== strlen($contents)) throw new RuntimeException('Cannot write private configuration file.');
    if (!rename($temporary, $path)) throw new RuntimeException('Cannot save private configuration file.');
    $temporary = null;
    fwrite(STDOUT, "Database settings saved privately. Connection has not yet been tested.\n");
} catch (Throwable $error) {
    if (is_string($temporary) && is_file($temporary)) unlink($temporary);
    // Emit only the fixed diagnostic messages authored above; never runtime exception text.
    $safeMessages = [
        'Usage: php configure-database.php DATABASE_NAME DATABASE_USERNAME',
        'Private config.php is missing or is a symlink.',
        'Configuration cannot be loaded. No values were displayed.',
        'Configuration format needs repair. No changes made.',
        'Run this command in your interactive SSH Terminal.',
        'Cannot safely hide password input.',
        'Input cancelled; configuration unchanged.',
        'Passwords were empty, too long, or did not match. Configuration unchanged.',
        'Cannot create private configuration file.',
        'Cannot write private configuration file.',
        'Cannot save private configuration file.',
    ];
    fwrite(STDERR, in_array($error->getMessage(), $safeMessages, true) ? $error->getMessage() . PHP_EOL : "Setup failed; no secret values were displayed.\n");
    exit(1);
}
