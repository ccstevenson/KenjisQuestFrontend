'use strict';

/* Directives */


angular.module('myApp.directives', [])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('characterCard', function () {
        return {
            restrict: 'E',
            scope: {
                character: '=character'
            },
            templateUrl: 'partials/character-card.html'
        }
    })

    .directive('calculator', function () {
        return {
            restrict: 'E',
            scope: {
                player: '=player',
                enemy: '=enemy',
                callback: '&callback'
            },
            templateUrl: 'partials/calculator.html',
            controller: function ($scope) {

                var init = function () {
                    $scope.attackData = {
                        'attackValue': 0,
                        'heal': false,
                        'crit': false
                    };
                };

                $scope.attack = function () {
                    if ($scope.attackData.heal) {
                        $scope.attackData.attackValue *= -1;
                    }

                    $scope.callback({'damage': parseInt($scope.attackData.attackValue), 'character': $scope.enemy});
                };

                $scope.crit = function () {
                    $scope.attackData.crit = !$scope.attackData.crit;

                    if ($scope.attackData.crit) {
                        $scope.attackData.attackValue *= 2;
                    }
                    else {
                        $scope.attackData.attackValue /= 2;
                    }
                };

                $scope.heal = function () {
                    $scope.attackData.heal = !$scope.attackData.heal;
                };

                $scope.keystroke = function (keypressValue) {
                    $scope.attackData.attackValue += keypressValue;
                };

                $scope.cancel = function () {
                    $scope.player = null;
                    $scope.enemy = null;
                };

                $scope.clear = function () {
                    init();
                };

                init();
            }
        }
    });
