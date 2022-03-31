<?php
    header("Content-type: application/javascript");
    echo "var serverImages = [";
    $files = scandir("./media/");
    for($i = 2; $i < count($files); $i += 1){
        echo "\"";
        echo $files[$i];
        echo "\"";
        if($i < count($files) - 1)
            echo ',';
    }
    echo '];'
?>