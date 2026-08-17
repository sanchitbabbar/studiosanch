<?php
header('Content-Type: application/json');

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Check if email is provided
    if (!isset($data['email']) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        exit;
    }
    
    // Get the email address
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Save the email to a subscribers file as backup
    $subscribersFile = __DIR__ . '/subscribers.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "$timestamp - $email\n";
    
    // Append to subscribers file
    file_put_contents($subscribersFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    // Log this subscription attempt
    error_log("Newsletter subscription attempt from: $email", 0);
    
    // Email content
    $to = $email;
    $subject = "Welcome to Studio Sanch Newsletter";
    $message = '
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                color: #333;
            }
            h1 {
                color: #000;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 20px;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <h1>STUDIO SANCH</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will now receive updates about our latest collections, events, and exclusive offers.</p>
        <div class="footer">
            &copy; ' . date('Y') . ' Studio Sanch. All rights reserved.<br>
            If you wish to unsubscribe, please reply to this email with "UNSUBSCRIBE" in the subject line.
        </div>
    </body>
    </html>
    ';
    
    // Set email headers
    $headers = "From: hello@studiosanch.com\r\n";
    $headers .= "Reply-To: hello@studiosanch.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send the email
    $emailSent = false;
    
    try {
        $emailSent = mail($to, $subject, $message, $headers);
        // Log the mail attempt
        error_log("Mail send attempt to $to: " . ($emailSent ? 'SUCCESS' : 'FAILED'), 0);
    } catch (Exception $e) {
        error_log("Exception sending mail to $to: " . $e->getMessage(), 0);
    }
    
    // Even if mail fails, we've saved the subscriber to our file
    if ($emailSent) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Subscription successful']);
    } else {
        // We'll still treat this as a success since we've stored the email
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Subscription received. Email confirmation might be delayed.'
        ]);
        
        // Log the failure for admin reference
        error_log("Failed to send confirmation email to $email but subscription was recorded", 0);
    }
} else {
    // Handle non-POST requests
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
