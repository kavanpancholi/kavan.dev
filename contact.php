<?php
require_once 'swiftmailer/lib/swift_required.php';
require_once 'environment.php';

if ($_POST) {
    if ($_POST['name'] && $_POST['name'] != '' && $_POST['email'] && $_POST['email'] != '' && $_POST['subject'] && $_POST['subject'] != '' && $_POST['message'] && $_POST['message'] != '') {

        if ($_POST['g-recaptcha-response'] == '') {
            echo "Please validate with captcha that you are a human. 😜";
            return;
        }

        $message = "<h3>Contact form from kavanpancholi.com</h3>";
        $message .= "<p>Name: " . $_POST['name'] . "</p>";
        $message .= "<p>Email: " . $_POST['email'] . "</p>";
        $message .= "<p>Subject: " . $_POST['subject'] . "</p>";
        $message .= "<p>Message: " . $_POST['message'] . "</p>";

        $transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, "ssl")
            ->setUsername($mail_username)
            ->setPassword($mail_password);

        $mailer = Swift_Mailer::newInstance($transport);

        $mail = Swift_Message::newInstance('Contact form from Kavanpancholi.com')
            ->setFrom(array('kavanpancholi@gmail.com' => 'Kavan Pancholi'))
            ->setTo(array('kavanpancholi@gmail.com'))
            ->setBody($message, 'text/html');

        $result = $mailer->send($mail);
        echo ($result) ? 'Success' : 'Something went wrong! Please try again later.';
    } else {
        echo "Please fill all details";
    }
} else {
    echo "Something went wrong! Please try again later.";
}