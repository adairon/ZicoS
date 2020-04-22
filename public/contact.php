<?php

var_dump($_POST);

$objet = $_POST['object'];
$message = $_POST['message'];
$headers = 'FROM : site@local.dev';

mail('adairon@outlook.fr', $objet, $message, $headers);