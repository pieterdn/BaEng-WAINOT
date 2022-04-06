


<?php
    $currentDir = getcwd();
    $uploadDirectory = "media/";

    // Store all errors
    $errors = [];

    if(isset($_POST['url'])){
        $url = $_POST['url'];
        $img = $_POST['id'] . '.jpg';
        //$uploadPath = $currentDir . $uploadDirectory . basename($img);
        // Function to write image into file
        file_put_contents("media/" . $img, file_get_contents($url));
        //move_uploaded_file($img, $uploadPath);

        echo "foto opgelsagen";
    }
    /*
    function file_get_contents_curl($url) {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);

        $data = curl_exec($ch);
        curl_close($ch);

        return $data;
    }
    if(isset($_POST['url'])){
        $data = file_get_contents_curl($_POST['url']);

        $fp = $_POST['id'] . '.jpg';

        file_put_contents( $fp, $data );
        echo "File downloaded!";
    }*/

?>
