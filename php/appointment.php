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
    
    // Check if required fields are provided
    if (!isset($data['email']) || empty($data['email']) || 
        !isset($data['name']) || empty($data['name']) || 
        !isset($data['date']) || empty($data['date']) || 
        !isset($data['time']) || empty($data['time'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Required fields missing']);
        exit;
    }
    
    // Extract and sanitize data
    $name = htmlspecialchars($data['name']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $phone = isset($data['phone']) ? htmlspecialchars($data['phone']) : 'Not provided';
    $date = htmlspecialchars($data['date']);
    $time = htmlspecialchars($data['time']);
    $service = isset($data['service']) ? htmlspecialchars($data['service']) : 'Consultation';
    $message = isset($data['message']) ? htmlspecialchars($data['message']) : 'None';
    $newsletter = isset($data['newsletter']) && $data['newsletter'] === true;
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Send confirmation email to customer
    $customerSubject = "Your Studio Sanch Appointment Confirmation";
    $customerMessage = '
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
            ul {
                padding-left: 20px;
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
        <p>Dear ' . $name . ',</p>
        <p>Thank you for booking an appointment with Studio Sanch.</p>
        <p><strong>Appointment Details:</strong></p>
        <ul>
            <li>Date: ' . $date . '</li>
            <li>Time: ' . $time . '</li>
            <li>Service: ' . $service . '</li>
        </ul>
        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        <div class="footer">
            &copy; ' . date('Y') . ' Studio Sanch. All rights reserved.
        </div>
    </body>
    </html>
    ';
    
    // Customer email headers
    $customerHeaders = "From: rdv@studiosanch.com\r\n";
    $customerHeaders .= "Reply-To: rdv@studiosanch.com\r\n";
    $customerHeaders .= "MIME-Version: 1.0\r\n";
    $customerHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send notification email to Studio Sanch
    $adminSubject = "New Appointment Booking";
    $adminMessage = '
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
            ul {
                padding-left: 20px;
            }
        </style>
    </head>
    <body>
        <h1>STUDIO SANCH</h1>
        <p><strong>New Appointment Request:</strong></p>
        <ul>
            <li>Name: ' . $name . '</li>
            <li>Email: ' . $email . '</li>
            <li>Phone: ' . $phone . '</li>
            <li>Date: ' . $date . '</li>
            <li>Time: ' . $time . '</li>
            <li>Service: ' . $service . '</li>
            <li>Message: ' . $message . '</li>
        </ul>
    </body>
    </html>
    ';
    
    // Admin email headers
    $adminHeaders = "From: rdv@studiosanch.com\r\n";
    $adminHeaders .= "Reply-To: " . $email . "\r\n";
    $adminHeaders .= "MIME-Version: 1.0\r\n";
    $adminHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send emails
    $customerEmailSent = mail($email, $customerSubject, $customerMessage, $customerHeaders);
    $adminEmailSent = mail('rdv@studiosanch.com', $adminSubject, $adminMessage, $adminHeaders);
    
    // If they want to subscribe to the newsletter
    if ($newsletter) {
        // This could call the subscribe.php logic or just handle it directly here
        // For simplicity, we'll just send another email
        $newsletterSubject = "Welcome to Studio Sanch Newsletter";
        $newsletterMessage = '
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
        
        $newsletterHeaders = "From: hello@studiosanch.com\r\n";
        $newsletterHeaders .= "Reply-To: hello@studiosanch.com\r\n";
        $newsletterHeaders .= "MIME-Version: 1.0\r\n";
        $newsletterHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        mail($email, $newsletterSubject, $newsletterMessage, $newsletterHeaders);
    }
    
    // Check if emails were sent
    if ($customerEmailSent && $adminEmailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Appointment booked successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to send confirmation emails, but your appointment was recorded'
        ]);
    }
} else {
    // Handle non-POST requests
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
