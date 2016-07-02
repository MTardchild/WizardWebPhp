angular.module("wizardApp").controller("setupWizardController", ['$rootScope', '$scope', '$document', '$timeout', function($rootScope, $scope, $document, $timeout) {
    $scope.arePlayerNamesEntered = false;
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
    $scope.totalScores;
    $scope.playerNameMatchesCount;

    var wizardCardCount = 60;
    var roundPredictionsMade = 0;
    var roundTricksMade = 0;
    
    var slider = "";

    $scope.onPlayerNameEntered = function() {
        if ($scope.playerNames[$scope.currentPlayer] == undefined
            || $scope.playerNames[$scope.currentPlayer] == null) {
            // TODO: Handle + output for user
            return;
        }

        getExactPlayerNameMatchesCount($scope.playerNames[$scope.currentPlayer]);
        ++$scope.currentPlayer;
        $rootScope.$broadcast('playerNameEntered', undefined);
    };

    $scope.onAllPlayerNamesEntered = function() {
        $scope.playerCount = $scope.currentPlayer + 1;
        $scope.maximumRoundCount = (wizardCardCount / $scope.playerCount) - 1;
        initializeArrays();
        $scope.cardGiverIndex = decideCardGiver();
        $scope.firstPredictorIndex = decideFirstPredictor();
        $scope.currentPlayer = $scope.firstPredictorIndex;
        $scope.arePlayerNamesEntered = true;
        initializeSliderControl();
        $timeout(setCurrentPlayerBanner, 500);
    };

    $scope.onPredictionMade = function() {
        var predictionCurrentUser = slider.noUiSlider.get();
        $scope.predictions[$scope.roundCounter][$scope.currentPlayer] = parseInt(predictionCurrentUser);
        ++roundPredictionsMade;
        resetCurrentPlayerBanner();
        $scope.currentPlayer = getNextPlayerIdentifier($scope.currentPlayer);
        slider.noUiSlider.set(0);
        setCurrentPlayerBanner();

        if (roundPredictionsMade == $scope.playerCount) {
            onAllPredictionsMade();
        }
    };

    $scope.onTrickMade = function() {
        var tricksCurrentUser = slider.noUiSlider.get();
        $scope.tricks[$scope.roundCounter][$scope.currentPlayer] = parseInt(tricksCurrentUser);
        ++roundTricksMade;
        $scope.currentPlayer = getNextPlayerIdentifier($scope.currentPlayer);
        slider.noUiSlider.set($scope.predictions[$scope.roundCounter][$scope.currentPlayer]);

        if (roundTricksMade >= $scope.playerCount - 1) {
            setTricksLastPlayer();
            $scope.currentPlayer = getNextPlayerIdentifier($scope.currentPlayer);
            onRoundEnd();
        }
    };

    function setCurrentPlayerBanner() {
        var playerBanner = $document.find(".playerBanner")[0];
        playerBanner.children[$scope.currentPlayer].children[0].className += " currentPlayer";
    }

    function resetCurrentPlayerBanner() {
        var playerBanner = $document.find(".playerBanner")[0];
        playerBanner.children[$scope.currentPlayer].children[0].className = playerBanner.children[$scope.currentPlayer].children[0].className.replace(" currentPlayer", "");
    }

    function setTricksLastPlayer() {
        var trickCount = getTrickCountCurrentRound();
        $scope.tricks[$scope.roundCounter][$scope.currentPlayer] = $scope.roundCounter + 1 - trickCount;
    }

    function getTrickCountCurrentRound() {
        var tricksMadeCurrentRound = 0;

        for (var i = 0; i < $scope.tricks[$scope.roundCounter].length; ++i) {
            if ($scope.tricks[$scope.roundCounter][i] != null) {
                tricksMadeCurrentRound += $scope.tricks[$scope.roundCounter][i];
            }
        }

        return tricksMadeCurrentRound;
    }

    $scope.registerUserKeyRelease = function(event) {
        $rootScope.$broadcast('keyReleased', event);
    };

    $scope.registerUserKeyPress = function(event) {
        $rootScope.$broadcast('keyPressed', event);
    };

    $scope.keyPressed = function(event) {
        if ($scope.arePlayerNamesEntered) {
            if (event.which == 13) {
                if ($scope.arePredictionsDone) {
                    $scope.onTrickMade();
                } else {
                    $scope.onPredictionMade();
                }
            } else if (event.which == 37) {
                slider.noUiSlider.set(parseInt(slider.noUiSlider.get()) - 1);
            } else if (event.which == 39) {
                slider.noUiSlider.set(parseInt(slider.noUiSlider.get()) + 1);
            }
        }
    };

    function initializeSliderControl() {
        slider = $document.find("#slider")[0];
        var maximumSliderValue = $scope.roundCounter + 1;

        noUiSlider.create(slider,
            {
                start: 0,
                step: 1,
                orientation: 'horizontal',
                range: {
                    'min': 0,
                    'max': maximumSliderValue
                },
                pips: {
                    mode: 'steps',
                    density: 100/maximumSliderValue
            }
        });
    }
    
    function recreateSlider() {
        slider.noUiSlider.destroy();
        initializeSliderControl();
    }

    function calculateTotalScore() {
        for (var indexPlayer = 0; indexPlayer < $scope.playerCount; ++indexPlayer) {
            for (var indexRound = 0; indexRound < $scope.roundCounter + 1; ++indexRound) {
                var roundScore = calculateRoundScore(indexPlayer, indexRound);
                $scope.totalScores[indexPlayer] += roundScore;
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
        calculateTotalScore();
        resetRoundVariables();
        ++$scope.roundCounter;
        recreateSlider();

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
        slider.noUiSlider.set($scope.predictions[$scope.roundCounter][$scope.currentPlayer]);
    }

    function getNextPlayerIdentifier(currentIdentifier) {
        var nextPlayerIdentifier = currentIdentifier + 1;

        if (currentIdentifier == $scope.playerCount - 1) {
            nextPlayerIdentifier = 0;
        }

        return nextPlayerIdentifier;
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

    function createTwoDimensionalArray(rows, columns) {
        var twoDimensionalArray = new Array(rows);

        for (var i = 0; i < rows; ++i) {
            twoDimensionalArray[i] = new Array(columns);
        }

        return twoDimensionalArray;
    }

    function initializeArrays() {
        $scope.totalScores = Array.apply(null, Array($scope.playerCount)).map(Number.prototype.valueOf, 0);
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
