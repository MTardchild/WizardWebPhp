angular.module("wizardApp").controller("setupWizardController", ['$scope', '$document', function($scope, $document) {
	$scope.arePlayerNamesEntered = false;
	$scope.isCardShufflerDecided = false;
	$scope.arePredictionsDone = false;
	$scope.isGameFinished = false;

	$scope.playerCount = 0;
	$scope.roundCounter = 0;
	$scope.maximumRoundCount = 0;
	$scope.cardGiverIndex = 0;
	$scope.firstPredictorIndex = 0;
	$scope.currentPlayer = 0;

	$scope.playerNames = new Array(6);
	$scope.tricks;
	$scope.predictions;
	$scope.scores;
	$scope.playerNameMatchesCount;

	var wizardCardCount = 60;
	var roundPredictionsMade = 0;
	var roundTricksMade = 0;
	var currentSelectedPlayerNameMatch = 1;
	var isCtrlPressed = false;

	$scope.onPlayerNameEntered = function() {
		if ($scope.playerNames[$scope.currentPlayer] == undefined
		|| $scope.playerNames[$scope.currentPlayer] == null) {
			// TODO: Handle + output for user
			return;
		}

		refreshSliderBitch();

		getExactPlayerNameMatchesCount($scope.playerNames[$scope.currentPlayer]);
		++$scope.currentPlayer;
		setPlayerNameMatchesText(undefined);
	};

    $scope.onAllPlayerNamesEntered = function() {
		$scope.arePlayerNamesEntered = true;
		$scope.playerCount = $scope.currentPlayer + 1;
		$scope.maximumRoundCount = (wizardCardCount / $scope.playerCount) - 1;
		initializeArrays();
		$scope.cardGiverIndex = decideCardGiver();
		$scope.firstPredictorIndex = decideFirstPredictor();
		onCardGiverDecided();
    };

	$scope.onPredictionMade = function() {
		++roundPredictionsMade;
		$scope.currentPlayer = getNextPlayerIdentifier($scope.currentPlayer);

		if (roundPredictionsMade == $scope.playerCount) {
			onAllPredictionsMade();
		}
	};

	$scope.onTrickMade = function() {
		++roundTricksMade;
		$scope.currentPlayer = getNextPlayerIdentifier($scope.currentPlayer);

		if (roundTricksMade >= $scope.playerCount) {
			onRoundEnd();
		}
	};

	$scope.registerUserKeyRelease = function(event) {
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
	};

	$scope.registerUserKeyPress = function(event) {
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
	};

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

    function calculateScore() {
        for (var indexPlayer = 0; indexPlayer < $scope.playerCount; ++indexPlayer) {
            $scope.scores[indexPlayer] = 0;

            for (var indexRound = 0; indexRound < $scope.roundCounter; ++indexRound) {
                var roundScore = calculateRoundScore(indexPlayer, indexRound);
                $scope.scores[indexPlayer] += roundScore;
            }
        }
    }

    function calculateRoundScore(indexPlayer, indexRound) {
        var score = 0;
        var prediction = $scope.predictions[indexRound][indexPlayer];
        var trickCount = $scope.tricks[indexRound][indexPlayer];

        if (trickCount == prediction) {
            score = trickCount + 2;
        } else {
            score = - Math.abs(trickCount - prediction);
        }

        return score;
    }

	function onRoundEnd() {
		getNewPlayerRoles();
		calculateScore();
		resetRoundVariables();
		++$scope.roundCounter;

		if ($scope.roundCounter >= $scope.maximumRoundCount) {
			$scope.isGameFinished = true;
		}
	}

	function getNewPlayerRoles() {
		$scope.firstPredictorIndex = getNextPlayerIdentifier($scope.firstPredictorIndex);
		$scope.cardGiverIndex = getNextPlayerIdentifier($scope.cardGiverIndex);
		$scope.currentPlayer = $scope.firstPredictorIndex;
	}

	function resetRoundVariables() {
		roundPredictionsMade = 0;
		roundTricksMade = 0;
		$scope.arePredictionsDone = false;
	}

	function onAllPredictionsMade() {
		$scope.arePredictionsDone = true;
	}

	function getNextPlayerIdentifier(currentIdentifier) {
		var nextPlayerIdentifier = currentIdentifier + 1;

		if (currentIdentifier == $scope.playerCount - 1) {
			nextPlayerIdentifier = 0;
		}

		return nextPlayerIdentifier;
	}

	function onCardGiverDecided() {
		$scope.isCardShufflerDecided = true;
		startGame();
	}

	function decideFirstPredictor() {
		var firstPredictorIndex = $scope.cardGiverIndex + 1;

		if ($scope.cardGiverIndex == $scope.playerCount - 1) {
			firstPredictorIndex = 0;
		}

		return firstPredictorIndex;
	}

	function decideCardGiver() {
		return Math.floor(Math.random() * $scope.playerCount);
	}

	function getIndexOfMaximum(array) {
		var maximumValue = Math.max(array);
		return array.indexOf(maximumValue);
	}

	function startGame() {
		$scope.currentPlayer = $scope.firstPredictorIndex;
	}

	function createTwoDimensionalArray(rows, columns) {
		var twoDimensionalArray = new Array(rows);

		for (i = 0; i < rows; ++i) {
			twoDimensionalArray[i] = new Array(columns);
		}

		return twoDimensionalArray;
	}

	function initializeArrays() {
		$scope.scores = new Array($scope.playerCount);
		$scope.tricks = createTwoDimensionalArray($scope.maximumRoundCount, $scope.playerCount);
		$scope.predictions = createTwoDimensionalArray($scope.maximumRoundCount, $scope.playerCount);
	}

    $scope.debugToEnd = function () {
		for (var indexRound = 0; indexRound < $scope.maximumRoundCount - 1; ++indexRound) {
        	for (var indexPlayer = 0; indexPlayer < $scope.playerCount; ++indexPlayer) {
                $scope.predictions[indexRound][indexPlayer] = Math.floor(Math.random() * 10);
                $scope.tricks[indexRound][indexPlayer] = Math.floor(Math.random() * 10);
            }
        }

        $scope.roundCounter = $scope.maximumRoundCount - 1;
    };
}]);
