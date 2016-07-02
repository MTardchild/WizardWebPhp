angular.module('wizardApp').controller('databaseMatchesController', function($scope, $document) {
    var currentSelectedPlayerNameMatch = 1;
    var isCtrlPressed = false;

    $scope.$on('keyPressed', function(event, args) {
        registerUserKeyPress(args);
    });

    $scope.$on('keyReleased', function(event, args) {
       registerUserKeyRelease(args);
    });

    $scope.$on('playerNameEntered', function(event, args) {
       setPlayerNameMatchesText(args);
    });
    
    function registerUserKeyRelease(event) {
        switch (event.keyCode) {
            case 13: // Enter
                if (!isCtrlPressed) {
                    $scope.playerNames[$scope.currentPlayer] = getCurrentSelectedPlayerNameMatch();
                }
                break;
            case 17: // Ctrl
                isCtrlPressed = false;
                break;
            case 37: // Left Arrow
                changeSelectedPlayerNameMatch(true);
                break;
            case 39: // Right Arrow
                changeSelectedPlayerNameMatch(false);
                break;
            default:
                getPlayerNameMatches($scope.playerNames[$scope.currentPlayer]);
                resetSelectedPlayerNameMatchClasses();
                $document.find("#playerNameMatchMiddle")[0].className = "selected";
                currentSelectedPlayerNameMatch = 0;
                break;
        }
    }

    function registerUserKeyPress(event) {
        switch (event.keyCode) {
            case 17: // Ctrl
                isCtrlPressed = true;
                break;
            case 13: // Enter
                if (isCtrlPressed) {
                    $scope.onPlayerNameEntered();
                }

                break;
        }
    }

    function getCurrentSelectedPlayerNameMatch() {
        var currentSelectedPlayerNameMatchString = "";
        switch (currentSelectedPlayerNameMatch) {
            case 2:
                currentSelectedPlayerNameMatchString = $document.find("#playerNameMatchLeft")[0].innerHTML;
                break;
            case 0:
                currentSelectedPlayerNameMatchString = $document.find("#playerNameMatchMiddle")[0].innerHTML;
                break;
            case 1:
                currentSelectedPlayerNameMatchString = $document.find("#playerNameMatchRight")[0].innerHTML;
                break;
        }

        return currentSelectedPlayerNameMatchString;
    }

    function getPlayerNameMatches(userInput) {
        if (userInput == "") {
            setPlayerNameMatchesText(undefined);
        } else {
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function() {
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    setPlayerNameMatchesText(JSON.parse(xmlHttpRequest.responseText));
                }
            };

            xmlHttpRequest.open("GET", "php/getBestPlayerNameMatch.php?input=" + userInput, true);
            xmlHttpRequest.send();
        }
    }

    function setPlayerNameMatchesText(playerNameMatches) {
        if (playerNameMatches == undefined) {
            $document.find("#playerNameMatchLeft")[0].innerHTML = "";
            $document.find("#playerNameMatchMiddle")[0].innerHTML = "";
            $document.find("#playerNameMatchRight")[0].innerHTML = "";
            return;
        }

        var playerNameMatchesCount = 0;

        if (playerNameMatches[2] == undefined) {
            $document.find("#playerNameMatchLeft")[0].innerHTML = "";
        } else {
            $document.find("#playerNameMatchLeft")[0].innerHTML = playerNameMatches[2];
            ++playerNameMatchesCount;
        }

        if (playerNameMatches[0] == undefined) {
            $document.find("#playerNameMatchMiddle")[0].innerHTML = "";
        } else {
            $document.find("#playerNameMatchMiddle")[0].innerHTML = playerNameMatches[0];
            ++playerNameMatchesCount;
        }

        if (playerNameMatches[1] == undefined) {
            $document.find("#playerNameMatchRight")[0].innerHTML = "";
        } else {
            $document.find("#playerNameMatchRight")[0].innerHTML = playerNameMatches[1];
            ++playerNameMatchesCount;
        }

        $scope.playerNameMatchesCount = playerNameMatchesCount;
    }

    function changeSelectedPlayerNameMatch(toLeft) {
        var playerNameMatchesCount = $scope.playerNameMatchesCount;

        switch(currentSelectedPlayerNameMatch) {
            case 0:
                if (toLeft) { // Left Arrow Key Pressed
                    if (playerNameMatchesCount == 3) {
                        currentSelectedPlayerNameMatch = 2;
                    } else if (playerNameMatchesCount == 2) {
                        currentSelectedPlayerNameMatch = 1;
                    }
                } else {
                    if (playerNameMatchesCount != 1) {
                        currentSelectedPlayerNameMatch = 1;
                    }
                }
                break;
            case 1:
                if (toLeft) {
                    currentSelectedPlayerNameMatch = 0;
                } else {
                    if (playerNameMatchesCount == 2) {
                        currentSelectedPlayerNameMatch = 0;
                    } else {
                        currentSelectedPlayerNameMatch = 2;
                    }
                }
                break;
            case 2:
                if (toLeft) {
                    currentSelectedPlayerNameMatch = 1;
                } else {
                    currentSelectedPlayerNameMatch = 0;
                }
                break;
        }

        resetSelectedPlayerNameMatchClasses();
        changeSelectedPlayerNameMatchClass();
    }

    function changeSelectedPlayerNameMatchClass() {
        var currentSelectedPlayerNameMatchSpan;
        switch (currentSelectedPlayerNameMatch) {
            case 2:
                currentSelectedPlayerNameMatchSpan = $document.find("#playerNameMatchLeft")[0];
                break;
            case 0:
                currentSelectedPlayerNameMatchSpan = $document.find("#playerNameMatchMiddle")[0];
                break;
            case 1:
                currentSelectedPlayerNameMatchSpan = $document.find("#playerNameMatchRight")[0];
                break;
        }

        currentSelectedPlayerNameMatchSpan.className = "selected";
    }

    function resetSelectedPlayerNameMatchClasses() {
        $document.find("#playerNameMatchLeft")[0].className = "";
        $document.find("#playerNameMatchMiddle")[0].className = "";
        $document.find("#playerNameMatchRight")[0].className = "";
    }
});
