<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function clean_field($value) {
    $value = trim((string) $value);
    return str_replace(["\r", "\n"], '', $value);
}

$to = 'renatourotjr@gmail.com';

$name    = clean_field($_POST['name'] ?? '');
$email   = clean_field($_POST['email'] ?? '');
$company = clean_field($_POST['company'] ?? '');
$service = clean_field($_POST['service'] ?? '');
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?sent=0');
    exit;
}

$subject = 'New inquiry from ' . $name . ' via Nexxabyte website';

$body  = "Name: $name\n";
$body .= "Email: $email\n";
$body .= 'Company: ' . ($company !== '' ? $company : '-') . "\n";
$body .= 'Service Interested In: ' . ($service !== '' ? $service : '-') . "\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: Nexxabyte Website <no-reply@nexxabyte.com>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Cc: inquiry@nexxabyte.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

header('Location: contact.html?sent=' . ($sent ? '1' : '0'));
exit;
