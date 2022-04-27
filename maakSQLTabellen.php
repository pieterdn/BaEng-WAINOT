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

$sql = 'CREATE TABLE MemoryGame (PersonID int, GameName varchar(20)';

for ($x = 0; $x <= 10; $x++) {
    $sql .= ', foto' . $x . ' int';
}

$sql .= ');';
/*
// select query
$sql = 'CREATE TABLE ' . $_GET["tableName"] . ' (';

for ($i = 0; $i < $_GET["width"]*$_GET["height"]; $i++) {
        $sql += 'foto' . strval($i) . ' char(1)';
        if($i == ($_GET["width"]*$_GET["height"])-1)
            break;
        $sql += ',';
}

$sql +=  ');';
*/
$conn->query($sql);

/*
if ($result = $conn->query($sql)) {
    while ($data = $result->fetch_object()) {
        $users[] = $data;
    }
}

foreach ($users as $user) {
    echo "<br>";
    echo $user->username . " " . $user->password;
    echo "<br>";
}*/
?>