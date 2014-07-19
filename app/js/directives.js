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
                character: '=character',
                selections: '=selections'
            },
            templateUrl: 'partials/character-card.html',
            controller: function ($scope) {
                $scope.isSelected = function() {
                    if ($scope.character == selections.activeActor || $scope.character == selections.activeTarget) {
                        return true;
                    }
                    return false;
                }
            }
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
                        'crit': false,
                        'action': 'Attack'
                    };
                };

                $scope.attack = function () {
                    if ($scope.attackData.heal) {
                        $scope.attackData.attackValue *= -1;
                    }

                    $scope.callback({'damage': parseInt($scope.attackData.attackValue), 'character': $scope.enemy});
                    init();
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

                    if ($scope.attackData.heal) {
                        $scope.attackData.action = 'Perform heal';
                    }
                    else {
                        $scope.attackData.action = 'Attack';
                    }
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
