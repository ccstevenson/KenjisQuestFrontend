'use strict';

/* Directives */


angular.module('myApp.directives', ['ui.bootstrap'])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('characterCard', function (roleService) {
        return {
            restrict: 'E',
            scope: {
                character: '=character',
                selections: '=selections',
                players: '=players',
                type: '=type'
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
                };


                $scope.setCharacterDetail = function($event,character){
                    $event.stopPropagation();
                    $scope.$parent.$parent.characterDetail = character;
                };

                $scope.showInfoIcon = function() {
                    if (roleService.role == 'Beast Master' || roleService.role == 'Game Master' || isPlayer()) {
                        return true;
                    }
                    return false;
                };

                var isPlayer = function() {
                    for (var i = 0; i < $scope.players.length; i++) {
                        var player = $scope.players[i];

                        if (player.id == $scope.character.id) {
                            return true
                        }
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

//                $scope.game = {};
//                $scope.game.soundPlay = false;

                $scope.attack = function () {
                    $scope.status = 'attack';
                    $scope.callback({'damage': parseInt($scope.attackData.attackValue), 'character': $scope.target, 'status': $scope.status});
                    init();
                };

                $scope.attackAll = function () {
                    $scope.status = 'attackAll';
                    $scope.callback({'damage': parseInt($scope.attackData.attackValue), 'character': $scope.target, 'status': $scope.status});
                    init();
                };

                $scope.heal = function () {
                    $scope.status = 'heal';
                    $scope.callback({'damage': parseInt($scope.attackData.attackValue) *-1, 'character': $scope.target, 'status': $scope.status});
                    init();
                };

                $scope.miss = function () {
                    $scope.status = 'miss';
                    // $scope.actor = null;
                    // $scope.target = null;
                    // $scope.player = null;
                    // $scope.enemy = null;
                    $scope.callback({'damage': 0, 'character': null, 'status': $scope.status});
                    init()
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

                $scope.keystroke = function (keypressValue) {
                    $scope.attackData.attackValue += keypressValue;
                };

                $scope.cancel = function () {
                    $scope.actor = null;
                    $scope.target = null;
                    $scope.player = null;
                    $scope.enemy = null;
                    init();
                };

                $scope.clear = function () {
                    init();
                };

                init();
            }
        }
    })

 .directive('characterCardDetail', function () {
        return {
            restrict: 'E',
            scope: {
                character: '=character'
            },
            templateUrl: 'partials/charac-card-detail.html',
            controller: function ($scope) {

                $scope.cancel= function(){
                    $scope.character = null;
                    $scope.$parent.$parent.characterDetail = null
                }
            }
        }
});

