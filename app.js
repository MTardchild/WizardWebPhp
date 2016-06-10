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
        restrict: "E",
        templateUrl: "components/round-view.html",
        replace: true
    };
});

wizardApp.controller('setupWizardController', function($scope) {
	$scope.isPlayerCountEntered = false;
	$scope.arePlayerNamesEntered = false;
	$scope.isCardShufflerDecided = false;
	$scope.arePredictionsDone = false;

    $scope.playerCount;
	$scope.roundCount = 0;
	$scope.maximumRoundCount;
	$scope.cardGiverIndex;
	$scope.firstPredictorIndex;
	$scope.currentPlayer;

	$scope.playerNames = [];
	$scope.cardGiverDecider = [];
	$scope.tricks = [];
	$scope.predictions = [];

	var wizardCardCount = 60;
	var predictionCount = 0;
	var trickCount = 0;

    $scope.onPlayerNamesEntered = function() {
		$scope.arePlayerNamesEntered = true;
		$scope.cardGiverIndex = decideCardGiver();
		$scope.firstPredictorIndex = decideFirstPredictor();
		onCardGiverDecided();
    }

	$scope.onPlayerCountEntered = function() {
		$scope.isPlayerCountEntered = true;
		$scope.maximumRoundCount = wizardCardCount / $scope.playerCount;
	}

	$scope.onPredictionMade = function() {
		++predictionCount;
		$scope.currentPlayer = getNextPlayerIdentifier();

		if (predictionCount == $scope.playerCount) {
			onAllPredictionsMade();
		}
	}

	$scope.onTrickMade = function() {
		++trickCount;
		$scope.currentPlayer = getNextPlayerIdentifier();

		if (trickCount == $scope.playerCount) {
			onRoundEnd();
		}
	}

	function onRoundEnd() {
		$scope.arePredictionsDone = false;
		predictionCount = 0;
		trickCount = 0;
		++$scope.roundCount;
	}

	function onAllPredictionsMade() {
		$scope.arePredictionsDone = true;

	}

	function getNextPlayerIdentifier() {
		var nextPlayerIdentifier = $scope.currentPlayer + 1;

		if ($scope.currentPlayer == $scope.playerCount - 1) {
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
		var maximumValue = Math.max(...array);
		return array.indexOf(maximumValue);
	}

	function startGame() {
		$scope.currentPlayer = $scope.firstPredictorIndex;
	}
});
