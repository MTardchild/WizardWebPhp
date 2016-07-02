angular.module("wizardApp").directive("navigationBar", function () {
    return {
        restrict: "A",
        templateUrl: "components/navigation.html",
        replace: true
    };
});

angular.module("wizardApp").directive("roundView", function () {
    return {
        restrict: "A",
        templateUrl: "components/round-view.html",
        link:    function postLink(scope, iElement, iAttrs){
            jQuery(document).on('keydown', function(e){
                scope.$apply(scope.keyPressed(e));
            });
        }
    };
});

angular.module("wizardApp").directive("gameFinished", function () {
    return {
        restrict: "A",
        templateUrl: "components/game-finished.html",
    };
});

angular.module("wizardApp").directive("databaseMatches", function () {
    return {
        restrict: "A",
        templateUrl: "components/database-matches.html",
    };
});
