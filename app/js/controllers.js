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

    .controller('BattleatronicCtrl', ['$scope', 'GameService', 'PlayerConstants', 'EnemyConstants',
        function ($scope, GameService, PlayerConstants, EnemyConstants) {

            $scope.game = {};

            $scope.game.players = PlayerConstants;
            $scope.game.enemies = EnemyConstants;

            GameService.$bind($scope, "game");

            $scope.selections = {
                activeActor: null,
                activeTarget: null
            };

            $scope.selectedPlayer = function (player) {
                $scope.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.selections.activeTarget = target;
            };

            $scope.dealDamage = function(damage, character) {
                character.health -= damage;

                if (character.health < 0) { // Negative health disallowed.
                    character.health = 0;
                }

                // The attack was completed. Deselect the two characters involved in the attack.
                $scope.selections.activeActor = null;
                $scope.selections.activeTarget = null;
            };

            $scope.makeSelection = function(character) {
                if ($scope.selections.activeActor == null) {
                    $scope.selections.activeActor = character;
                }
                else {
                    $scope.selections.activeTarget = character;
                }
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
