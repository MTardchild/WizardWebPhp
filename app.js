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

wizardApp.controller('setupWizardController', function($scope) {
	$scope.isPlayerCountEntered = false;
	$scope.arePlayerNamesEntered = false;
	$scope.isCardShufflerDecided = false;

    $scope.playerCount;
	$scope.roundCount = 0;
	$scope.maximumRoundCount;
	$scope.cardGiverIndex;

	$scope.playerNames = [];
	$scope.cardGiverDecider = [];
	$scope.tricks = [];
	$scope.predictions = [];

	var wizardCardCount = 60;

    $scope.onPlayerNamesEntered = function() {
		$scope.arePlayerNamesEntered = true;
    }

	$scope.onPlayerCountEntered = function() {
		$scope.isPlayerCountEntered = true;
		$scope.maximumRoundCount = wizardCardCount / $scope.playerCount;
	}

	$scope.onCardShufflerDecided = function() {
		$scope.isCardShufflerDecided = true;
		$scope.cardGiverIndex = decideCardGiver();
	}

	$scope.onPredictionsMade = function() {

	}

	$scope.onRoundEnd = function() {
		++$scope.roundCount;
		updateUserInterface();
	}

	function decideCardGiver() {
		return getIndexOfMaximum($scope.cardGiverDecider);
	}

	function getIndexOfMaximum(array) {
		var maximumValue = Math.max(...array);
		return array.indexOf(maximumValue);
	}

	function updateUserInterface() {

	}
});
