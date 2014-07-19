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
            controller: function($scope) {
                $scope.attackValue = '';
                $scope.heal = false;

                $scope.attack = function() {
                    $scope.callback({'damage': parseInt($scope.attackValue), 'character': $scope.enemy});
                };

                $scope.keystroke = function(keypressValue) {
                    $scope.attackValue += keypressValue;
                };
            }
        }
    });
