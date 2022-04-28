<?php



    //These are the defined authentication environment in the db service

    // The MySQL service named in the docker-compose.yml.
    $host = 'db';

    // Database use name
    $user = 'MYSQL_USER';

    //database user password
    $pass = 'MYSQL_PASSWORD';

    // database name
    $mydatabase = 'MYSQL_DATABASE';

    // check the MySQL connection status
    $conn = new mysqli($host, $user, $pass, $mydatabase);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        //echo "Connected to MySQL server successfully!";
    }
if(isset($_POST['kaart'])){
    saveProgress($_POST['id'],$_POST['spelnaam'],$_POST['kaart']);
} else if(isset($_POST['reset'])){
    resetGameProgress($_POST['id'],$_POST['spelnaam']);
}
else if(isset($_POST['id'])){
    getProgress($_POST['id'],$_POST['spelnaam']);
    //getProgress(123,"test.html");
} 

function getProgress($varID,$Gnaam){
    global $conn;
    // select query
    $sql = 'SELECT PersonID,GameName FROM MemoryGame WHERE PersonID=' . $varID . ' AND GameName="' . $Gnaam .'"';
    //echo $sql;
    try{
        $out=0;
        if ($result = $conn->query($sql)) {
            while ($data = $result->fetch_object()) {
                //echo 'gevonden';
                //neem de progress
                getProgress_db($varID,$Gnaam);
                $out = 1;
            }
            if($out == 0){
                //nog nooit gespeeld -> laad spel
                $sql = 'INSERT INTO MemoryGame (PersonID, GameName) VALUES ("123","test.html");';
                $conn->query($sql);
            }
        }
    }
    catch( Exception $e) {
        echo 'error';        
    } 
}


function getProgress_db($varID,$Gnaam){
    global $conn;
    $sql = 'SELECT * FROM MemoryGame WHERE PersonID=' . $varID . ' AND GameName="' . $Gnaam .'"' ;
    //echo $sql;
    if ($res = $conn->query($sql)) {
        while ($data = $res->fetch_object()) {
            $results[] = $data;
            $str = '';
            foreach ($results as $result) {
                echo $result->PersonID . ";" . $result->GameName . ";" . $result->foto0 . ";" . 
                $result->foto1 . ";" . $result->foto2 . ";" . $result->foto3 . ";" . $result->foto4 . ";" . $result->foto5 . ";" . 
                $result->foto6 . ";" . $result->foto7 . ";" . $result->foto8 . ";" . $result->foto9 . ";" . $result->foto10. ";" . 
                $result->foto11 . ";" . $result->foto12 . ";" . $result->foto13 . ";" . $result->foto14 . ";" . $result->foto15 . ";" . 
                $result->foto16 . ";" . $result->foto17 . ";" . $result->foto18 . ";" . $result->foto19 . ";" . $result->foto20. ";" . 
                $result->foto21 . ";" . $result->foto22 . ";" . $result->foto23 . ";" . $result->foto24 . ";" . $result->foto25 . ";" . 
                $result->foto26 . ";" . $result->foto27 . ";" . $result->foto28 . ";" . $result->foto29 . ";" . $result->foto30. ";" . 
                $result->foto31. ";" . $result->foto32;
            }
            echo $str;
        }
    }
}

function saveProgress($varID,$Gnaam,$kaart){
    global $conn;
    $sql = 'UPDATE MemoryGame SET foto'. $kaart .'= 1 WHERE  PersonID=' . $varID . ' AND GameName="' . $Gnaam .'"  ;';
    $conn->query($sql);
}


function resetGameProgress($varID,$Gnaam){
    global $conn;
    $sql = 'DELETE FROM MemoryGame WHERE PersonID=' . $varID . ' AND GameName="' . $Gnaam .'"' ;
    $conn->query($sql);
    
}


?>


