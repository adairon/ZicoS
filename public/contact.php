<?php

// var_dump($_POST);

if ($_POST){
    http_response_code(200);
    
    $fromEmail = $_POST['email'];
    $objet = $_POST['object'];
    $message = $_POST['message'];
    
    //headers :
    $headers = "MIME-Version: 1.0\r\n";
    $headers.= "Content-type: text/html; charset=UTF-8\r\n";
    
    $headers .= "From: <" . $fromEmail . ">";
    
    mail('adairon@outlook.fr', $objet, $message, $headers);

    header('location: /');
}
