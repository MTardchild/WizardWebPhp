<?php
    $getRequestFromUserInput = $_GET['input'];

    $serverName = "localhost";
    $username = "wizardSqlHandler";
    $password = "wizard1337";
    $databaseName = "wizard";
    $database = new mysqli($serverName, $username, $password, $databaseName);

    if ($database->connect_errno) {
        echo "Failed to connect to MySQL database. (" . $database->connect_errno . ")" . $database->connect_error;
    }

    $sqlQuery = "SELECT plr_name FROM player WHERE plr_name LIKE\"" . $getRequestFromUserInput . "%\" LIMIT 3";
    $sqlQueryResult = $database->query($sqlQuery);

    if ($sqlQueryResult == false) {
        echo "Query failed. Error: (" . $database->connect_errno . ")" . $database->connect_error;
    }

    if ($database->close() == false) {
        echo "Closing the connection to the MySQL database failed. (" . $database->connect_errno . ")" . $database->connect_error;
    }

    $resultRows = $sqlQueryResult->fetch_all(MYSQLI_NUM);
    echo json_encode($resultRows);
?>
