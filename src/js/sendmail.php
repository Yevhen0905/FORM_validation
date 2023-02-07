<?php
// підключення файлів щоб плагін запрацював
   use PHPMailer\PHPMailer\PHPMailer;
   use PHPMailer\PHPMailer\Exception;

   require 'phpmailer/src/Exception.php';
   require 'phpmailer/src/PHPMailer.php';
//його оголошення, налаштування кодування, мовний файл, 
   $mail = new PHPMailer(true);
   $mail->Charset = 'UTF-8';
   $mail->setLanguage('ru', 'phpmailer/language');
   $mail->IsHTML(true);           // включаємо можливість HTML тегів в листі

   //від кого лист
   $mail->setForm('evgenav83@gmail.com', 'Evgen');
   //кому відправити
   $mail->addAddress('evgenav83@gmail.com');
   // тема листа
   $mail->Subject = 'hello';

   //рука, обробник форми
   $hand = 'right';
   if($_POST['hand'] == 'left') {
      $hand = 'left';
   }

   //тіло листа
   $body = '<h1>Meet the letter</h1>';

   //перевірки якщо поле не порожнє виводимо текст і дані 
   if(trim(!empty($_POST['name']))){
    $body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>' 
   }
   if(trim(!empty($_POST['email']))){
    $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>' 
  }
  if(trim(!empty($_POST['hand']))){
    $body.='<p><strong>Hand:</strong> '.$hand.'</p>' 
  }
  if(trim(!empty($_POST['age']))){
    $body.='<p><strong>Age:</strong> '.$_POST['age'].'</p>' 
  }
  if(trim(!empty($_POST['message']))){
    $body.='<p><strong>Message:</strong> '.$_POST['message'].'</p>' 
  }

  //прикрепити файл
  if(!empty($_FILES['image']['tmp_name'])) {
    //шлях завантаження файла
    $filePath = __DIR__ . '/files/' . $_FILES['image']['name'];
    // завантажуємо файл
    if(copy($_FILES['image']['tmp_name'], $filePath)) {
        $fileAttach = $filePath;                                     //копіюю на сервер в папочку, якщо вийшло додаємо текст листа і додаємо в плагін файл
        $body ='<p><strong>photo in the application</strong></p>';
        $mail->addAttachment($fileAttach);
    }
  }
// зібрану  привласнюємо в плагін
  $mail->Body = $body;    

  //відправлення
  if(!$mail->send()) {  // якщо не відправилася виводимо помилку
    $message = 'Error';
  } else {
    $message = 'Data sent!'
  }

  $response = ['message' => $message]; // формування Json

  header('Content-type: application/join');  // заголовко повертаємо в наш JS
  echo join_encode($response);
  ?>