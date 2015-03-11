<?php
  $error = array();
        $files = array();

        $uploadDir = './img/';

        foreach ($_FILES as $file) {

            $filename = explode(".", $file['name']);

            $ext = end($filename);
            // rename file to avoid duplicate names
            $file['name'] = str_replace('.'.$ext,'_'.rand(0,1000).'.'.$ext,$file['name']);

            // allowed types validation
            $allowedTypes = array('jpg', 'jpeg', 'gif', 'png');

            if (in_array(strtolower($ext), $allowedTypes)) {
                $error[] = "file type not allowed";
            }
                move_uploaded_file($file['tmp_name'], $uploadDir . basename($file['name']))
                $files[] = $uploadDir . $file['name'];
        }

        $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
        $data = array('success' => 'Form was submitted', 'formData' => $_REQUEST);

        echo json_encode($data);
?>
