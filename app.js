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
	$scope.arePlayerNamesEntered = true;
	$scope.isCardShufflerDecided = true;

    $scope.playerCount;
	$scope.roundCount = 1;

	$scope.player1Name = "";
    $scope.player2Name = "";
    $scope.player3Name = "";
    $scope.player4Name = "";
    $scope.player5Name = "";
    $scope.player6Name = "";

    $scope.onPlayerNamesEntered = function() {
		$scope.arePlayerNamesEntered = true;
		$scope.isCardShufflerDecided = false;
    }

	$scope.onPlayerCountEntered = function() {
		$scope.isPlayerCountEntered = true;
		$scope.arePlayerNamesEntered = false;
	}
});
