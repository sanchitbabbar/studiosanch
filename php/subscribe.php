<?php
declare(strict_types=1);
// Legacy mail endpoints are quarantined until a verified backend is configured.
// Never store addresses in the web root or send unsolicited confirmation mail.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
http_response_code(503);
echo json_encode(['success' => false, 'message' => 'This service is temporarily unavailable. Please contact contact@studiosanch.com.']);
