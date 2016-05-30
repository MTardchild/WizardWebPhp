angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

		// homepage
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

	$locationProvider.html5Mode(true);
}]);
