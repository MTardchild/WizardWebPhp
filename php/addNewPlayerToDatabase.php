<?php
    $newPlayerName = $_POST['playername'];

    $serverName = "localhost";
    $username = "wizardSqlHandler";
    $password = "wizard1337";
    $databaseName = "wizard";
    $database = new mysqli($serverName, $username, $password, $databaseName);

    if ($database->connect_errno) {
        echo "Failed to connect to MySQL database. (" . $database->connect_errno . ")" . $database->connect_error;
    }

    $sqlQuery = "INSERT INTO player (plr_name) VALUES (\"" . $newPlayerName . "\");";
    $sqlQueryResult = $database->query($sqlQuery);

    if ($sqlQueryResult == false) {
        echo "Query failed. Error: (" . $database->connect_errno . ")" . $database->connect_error;
    }

    if ($database->close() == false) {
        echo "Closing the connection to the MySQL database failed. (" . $database->connect_errno . ")" . $database->connect_error;
    }

    echo "New player created successfully.\nPlayer name: " . $newPlayerName;
?>
