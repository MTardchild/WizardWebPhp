var wizardApp = angular.module('wizardApp', []);

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

wizardApp.directive("databaseMatches", function () {
    return {
        restrict: "A",
        templateUrl: "components/database-matches.html",
    };
});
