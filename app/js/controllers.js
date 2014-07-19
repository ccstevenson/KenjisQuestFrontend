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

    .controller('BattleatronicCtrl', ['$scope', 'GameService', 'CharacterConstants', 'EnemyConstants',
        function ($scope, GameService, CharacterConstants, EnemyConstants) {

        $scope.game = {};

        $scope.game.characters = CharacterConstants;
        $scope.game.enemies = EnemyConstants;

        GameService.$bind($scope, "game");

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
