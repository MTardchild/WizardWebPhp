var wizardDirectives = angular.module("wizardDirectives", []);

wizardDirectives.directive("navigationBar", function () {
    return {
        restrict: "A",
        templateUrl: "/components/navigation.html",
        replace: true
    };
});

wizardDirectives.directive("amountOfPlayersInput", function () {
    return {
        restrict: "E",
        templateUrl: "/components/amount-of-players-input.html",
        replace: true
    };
});

wizardDirectives.directive("playerNameInput", function () {
    return {
        restrict: "E",
        templateUrl: "/components/player-name-input.html",
        replace: true
    };
});
