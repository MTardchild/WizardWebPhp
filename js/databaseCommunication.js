function addNewPlayerToDatabase(playerName) {
    var xmlHttpRequest = new XMLHttpRequest();
    var postParameters = "playername=" + playerName;

    xmlHttpRequest.onload = onNewPlayerAddedToDatabase;
    xmlHttpRequest.open("POST", "php/addNewPlayerToDatabase.php", true);
    xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttpRequest.send(postParameters);
}

function onNewPlayerAddedToDatabase() {
    if (	this.status == 200
        && 	this.response != null) {
        console.log(this.response);
    }
}

function getExactPlayerNameMatchesCount(playerName) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload = onExactPlayerNameMatchesCountRetrieved;
    xmlHttpRequest.open("GET", "php/isPlayerNameAlreadyExistent.php?playername=" + playerName, true);
    xmlHttpRequest.send();
}

function onExactPlayerNameMatchesCountRetrieved() {
    if (	this.status == 200
        && 	this.response != null) {
        var response = JSON.parse(this.response);
        if (response[0] == "0") {
            addNewPlayerToDatabase(response[1]);
        } else {
            return;
        }
    }
}
