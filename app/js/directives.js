'use strict';

/* Directives */


angular.module('myApp.directives', ['ui.bootstrap'])

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
                };

                $scope.healthBarType = function() { // Determines which color health bar to display
                    var health = $scope.character.health/$scope.character.maxHealth;

                    if (health >= .7) {
                        return "success";
                    }
                    else if (health < .7 && health > .3) {
                        return "warning";
                    }
                    else {
                        return "danger";
                    }
                }
            }
        }
    })

    .directive('calculator', function () {
        return {
            restrict: 'E',
            scope: {
                actor: '=actor',
                target: '=target',
                callback: '&callback'
            },
            templateUrl: 'partials/calculator.html',
            controller: function ($scope) {

                var init = function () {
                    $scope.attackData = {
                        'attackValue': 0,
                        'heal': 'Healing',
                        'crit': false,
                        'action': 'Attacking'
                    };
                };

                $scope.attack = function () {
                    $scope.callback({'damage': parseInt($scope.attackData.attackValue), 'character': $scope.target});
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
                    $scope.callback({'damage': parseInt($scope.attackData.attackValue) *-1, 'character': $scope.target});
                    init();
                };

                $scope.keystroke = function (keypressValue) {
                    $scope.attackData.attackValue += keypressValue;
                };

                $scope.cancel = function () {
                    $scope.actor = null;
                    $scope.target = null;
                };

                $scope.clear = function () {
                    init();
                };

                $scope.buttonText = function() {
                  if ($scope.attackData.action == 'Attacking') {
                      return "Attack";
                  }
                  else return "Heal";
                };

                init();
            }
        }
    });
