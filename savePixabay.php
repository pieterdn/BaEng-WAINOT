


<?php
    $currentDir = getcwd();
    $uploadDirectory = "//media/";

    // Store all errors
    $errors = [];

    if(isset($_POST['url'])){
        $url = $_POST['url'];

        $img = $_POST['id']+'.png';

        // Function to write image into file
        file_put_contents($img, file_get_contents($url));

        echo "File downloaded!";
    }
?>
