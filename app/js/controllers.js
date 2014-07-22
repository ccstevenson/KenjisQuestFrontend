'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('SoundboardCtrl', ['$scope', function ($scope) {

    }])

    .controller('CharacterCreationController', ['$scope', function ($scope) {

        $scope.addCharacter = function () {
            $scope.characters.$add({from: $scope.user, content: $scope.character});
            $scope.message = "";
        };

    }])

    .controller('GmViewCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {
        $scope.game = {};
        $scope.chapter = {};
        $scope.scenario = {};

        Restangular.all('games').getList().then(function (games) {
            $scope.games = games;
        });

        $scope.selectGame = function (game) {
            $scope.game = game;
            $scope.chapter = {};
        };
        $scope.selectChapter = function (chapter) {
            $scope.chapter = chapter
        };
        $scope.selectScenario = function (scenario) {
            $scope.scenario = scenario
        };
    }])

    .controller('BattleatronicCtrl', ['$scope', 'GameService', 'PlayerConstants', 'EnemyConstants',
        function ($scope, GameService, PlayerConstants, EnemyConstants) {
            GameService.$bind($scope, "game");

            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
            };

            $scope.dealDamage = function (damage, character) {
                character.health -= damage;

                if (character.health < 0) { // Negative health disallowed.
                    character.health = 0;
                }

                // The attack was completed. Deselect the two characters involved in the attack.
                $scope.game.selections.activeActor = null;
                $scope.game.selections.activeTarget = null;
            };

            $scope.makeSelection = function (character) {
                if (!$scope.game.selections || !$scope.game.selections.activeActor) {
                    $scope.game.selections = {
                        activeActor: character
                    };
                }
                else {
                    $scope.game.selections.activeTarget = character;
                }
            };

            $scope.resetGame = function () {
                $scope.game = {};

                $scope.game.selections = {
                    activeActor: null,
                    activeTarget: null
                };

                $scope.game.players = angular.copy(PlayerConstants);
                $scope.game.enemies = angular.copy(EnemyConstants);
            };

            //        $scope.user = "Guest " + Math.round(Math.random() * 101);
//        $scope.game = GameService;
////        $scope.$add({game: null});

            // This code works.
//        $scope.user = "Guest " + Math.round(Math.random() * 101);

//        $scope.addMessage = function () {
//            $scope.messages.$add({from: $scope.user, content: $scope.message});
//            $scope.message = "";
//        };

        }]);
