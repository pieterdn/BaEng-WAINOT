<?php
    header("Content-type: application/javascript");
    echo "var serverImages = [";
    $files = scandir("./media/");

    if (($key = array_search('.', $files)) !== false) {
        array_splice($files,$key,1);
    }
    if (($key = array_search('..', $files)) !== false) {
        array_splice($files,$key,1);
    }

    for($i = 0; $i < count($files); $i += 1){
        echo "\"";
        echo $files[$i];
        echo "\"";
        if($i < count($files) - 1)
            echo ',';
    }
    echo '];'
?>