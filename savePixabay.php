


<?php
    $currentDir = getcwd();
    $uploadDirectory = "media/";

    // Store all errors
    $errors = [];

    if(isset($_POST['url'])){
        $url = $_POST['url'];
        $img = $_POST['id'] . '.jpg';
        // Function to write image into file
        file_put_contents("media/" . $img, file_get_contents($url));
        echo $img;
    }
?>
