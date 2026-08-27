<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
try {
 $private = dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/')) . '/studio-sanch-private';
 if (!is_file($private . '/config.php') || !is_file($private . '/bootstrap.php')) throw new RuntimeException('Not configured');
 require $private . '/bootstrap.php';
 client_handle();
} catch (Throwable $error) {
 // Never log credentials, tokens or raw database exceptions.
 error_log('Studio Sanch client authentication unavailable');
 http_response_code(503);
 echo '{"error":"service_unavailable"}';
}
