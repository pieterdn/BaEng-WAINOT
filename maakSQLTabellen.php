<?php
/*
$_GET = array();

foreach($argv as $key => $pair) {
    if ($key == 0) { //skip first element which is script name (test.php)
        continue;
    }

    list($key, $value) = explode(":", $pair);
    $_GET[$key] = $value;
}
*/
//These are the defined authentication environment in the db service

// The MySQL service named in the docker-compose.yml.
$host = 'db';

// Database use name
$user = 'MYSQL_USER';

//database user password
$pass = 'MYSQL_PASSWORD';
$mydatabase = 'MYSQL_DATABASE';
// check the MySQL connection status
$conn = new mysqli($host, $user, $pass, $mydatabase);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected to MySQL server successfully!";
}
$sql = 'DROP TABLE MemoryGame;';
$conn->query($sql);
$sql = 'CREATE TABLE MemoryGame (PersonID int, GameName varchar(20)';

for ($x = 0; $x <= 32; $x++) {  //32 -> max 64 kaarten per 2
    $sql .= ', foto' . $x . ' int';
}

$sql .= ');'; 
$conn->query($sql);
//$sql = 'INSERT INTO MemoryGame (PersonID, GameName, foto0,foto1,foto2) VALUES ("123","test.html","1","0","0");';
//$conn->query($sql);

?>