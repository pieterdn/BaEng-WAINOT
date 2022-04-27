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
    echo "Connected to MySQL server successfully!";
}

getProgress(6);

function getProgress($varID){
    global $conn;
    // select query
    $sql = 'SELECT (PersonID,GameName) FROM MemoryGame WHERE PersonID = '. $varID  . ' GameName = "'. $varID . '"' ;

    try{
        if ($result = $conn->query($sql)) {
            while ($data = $result->fetch_object()) {
                //neem de progress
                getProgress_db();
            }
        }
    }
    catch( Exception $e) {
        //nog nooit gespeeld
        echo 'geen data gevonden';
    }
}


function getProgress_db(){
    $sql = 'SELECT * FROM MemoryGame WHERE PersonID = '. $varID  . ' GameName = "'. $varID . '"' ;

    if ($result = $conn->query($sql)) {
        while ($data = $result->fetch_object()) {
            $result[] = $data;
        }
    }
}

?>


