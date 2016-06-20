var wizardApp = angular.module('wizardApp', []);

var wizardApp = angular.module('wizardApp', ['ngRoute']);

wizardApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'setupWizardController'
		})

		.when('/newgame', {
			templateUrl: 'views/newgame.html',
			controller: 'setupWizardController'
		})

		.when('/history', {
			templateUrl: 'views/history.html',
			controller: 'setupWizardController'
		})

		.otherwise({
			redirectTo: '/'
		});
});

wizardApp.directive("navigationBar", function () {
    return {
        restrict: "A",
        templateUrl: "components/navigation.html",
        replace: true
    };
});

wizardApp.directive("roundView", function () {
    return {
        restrict: "A",
        templateUrl: "components/round-view.html",
    };
});

wizardApp.directive("gameFinished", function () {
    return {
        restrict: "A",
        templateUrl: "components/game-finished.html",
    };
});

wizardApp.controller('setupWizardController', function($scope) {
	$scope.isPlayerCountEntered = false;
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

	$scope.playerNames = new Array;
	$scope.cardGiverDecider = new Array;
	$scope.tricks = new Array;
	$scope.predictions = new Array;
    $scope.scores = new Array;

	var wizardCardCount = 60;
	var roundPredictionsMade = 0;
	var roundTricksMade = 0;

    $scope.onPlayerNamesEntered = function() {
		$scope.arePlayerNamesEntered = true;
		$scope.cardGiverIndex = decideCardGiver();
		$scope.firstPredictorIndex = decideFirstPredictor();
		onCardGiverDecided();
    };

	$scope.onPlayerCountEntered = function() {
		$scope.isPlayerCountEntered = true;
		$scope.maximumRoundCount = wizardCardCount / $scope.playerCount;
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

    function calculateScore() {
        for (indexPlayer = 0; indexPlayer < $scope.playerCount; ++indexPlayer) {
            $scope.scores[indexPlayer] = 0;

            for (indexRound = 0; indexRound < $scope.roundCounter; ++indexRound) {
                var roundScore = calculateRoundScore(indexPlayer, indexRound);
                $scope.scores[indexPlayer] += roundScore;
            }
        }
    }

    function calculateRoundScore(indexPlayer, indexRound) {
        var score = 0;
        var prediction = $scope.predictions[indexPlayer][indexRound];
        var trickCount = $scope.tricks[indexPlayer][indexRound];

        if (trickCount == prediction) {
            score = trickCount + 2;
        } else {
            score = - Math.abs(trickCount - prediction);
        }

        return score;
    }

	function onRoundEnd() {
		$scope.firstPredictorIndex = getNextPlayerIdentifier($scope.firstPredictorIndex);
		$scope.cardGiverIndex = getNextPlayerIdentifier($scope.cardGiverIndex);
		$scope.currentPlayer = $scope.firstPredictorIndex;
		calculateScore();
		roundPredictionsMade = 0;
		roundTricksMade = 0;
		++$scope.roundCounter;
		$scope.arePredictionsDone = false;

		if ($scope.roundCounter >= $scope.maximumRoundCount) {
			$scope.isGameFinished = true;
		}
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

    $scope.debugToEnd = function () {
        for (indexPlayer = 0; indexPlayer < $scope.playerCount; ++indexPlayer) {
            for (indexRound = 0; indexRound < $scope.roundCounter; ++indexRound) {
                $scope.predictions[indexPlayer][indexRound] = Math.random() * 10;
                $scope.tricks[indexPlayer][indexRound] = Math.random() * 10;
            }
        }

        $scope.roundCounter = $scope.maximumRoundCount - 1;
    };
});
