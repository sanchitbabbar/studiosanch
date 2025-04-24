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
    
    // Here you would typically save the email to your subscriber database
    // For this example, we'll just send a confirmation email
    
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
    $emailSent = mail($to, $subject, $message, $headers);
    
    // Check if the email was sent
    if ($emailSent) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Subscription successful']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send confirmation email']);
    }
} else {
    // Handle non-POST requests
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
