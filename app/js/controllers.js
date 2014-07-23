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

    .controller('GmViewCtrl', ['$scope', 'Restangular', 'scenarioService', function ($scope, Restangular, scenarioService) {
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
            $scope.chapter = chapter;
            $scope.scenario = {};
        };

        $scope.selectScenario = function (scenario) {
            scenarioService.scenario = scenario;
            window.location = '#/scenario';
        };

    }])

    .controller('RoleCtrl', ['$scope', 'roleService', function ($scope, roleService) {
        $scope.Role = roleService;
        $scope.roles = {
            Role1: "Game Master",
            Role2: "Player",
            Role3: "Beast Master"
        };

        $scope.selectRole = function (role) {
            roleService.role = role;
            console.log($scope.Role);
            if (role == "Player"){
                window.location = '#/battleatronic';
            }
        };
    }])

    .controller('ScenarioCtrl', ['$scope', 'scenarioService', 'encounterService', function ($scope, scenarioService, encounterService) {
        $scope.scenario = scenarioService.scenario;
        $scope.encounters = $scope.scenario.encounters;
        $scope.items = {};
        $scope.characters = {};

        $scope.selectEncounter = function (encounter) {
            $scope.encounter = encounter;
            $scope.items = encounter.items;
            $scope.characters = encounter.characters;
        };

        $scope.launchEncounter = function (encounter) {
            encounterService.characters = encounter.characters;
            encounterService.items = encounter.items;
            window.location = '#/battleatronic';
        };
    }])

    .controller('BattleatronicCtrl', ['$scope', 'GameService', 'PlayerConstants', 'EnemyConstants', 'roleService',
        function ($scope, GameService, PlayerConstants, EnemyConstants, roleService) {
            GameService.$bind($scope, "game");
            $scope.Role = roleService;
            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
            };

            $scope.dealDamage = function (damage, character) {

                if (damage > 0) {
                    $.playSound('sounds/attack');
                }
                else if (damage == 0) {
                    $.playSound ('sounds/miss');
                }
                else {
                    $.playSound ('sounds/heal');
                }


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

        }])

    .controller('VideosController', function ($scope, $http, $log, VideosService) {


        function init() {
          $scope.youtube = VideosService.getYoutube();
          $scope.results = VideosService.getResults();
          $scope.upcoming = VideosService.getUpcoming();
          // $scope.history = VideosService.getHistory();
          $scope.playlist = true;
        }

        init();

        $scope.launch = function (id, title) {
          VideosService.launchPlayer(id, title);
          // VideosService.archiveVideo(id, title);
          // VideosService.deleteVideo('upcoming', id);
          $scope.upcoming = VideosService.getUpcoming();
          // $scope.history = VideosService.getHistory();
          $log.info('Launched id:' + id + ' and title:' + title);
        };

        $scope.queue = function (id, title) {
          VideosService.queueVideo(id, title);
          $scope.upcoming = VideosService.getUpcoming();
          // VideosService.deleteVideo('history', id);
          // $scope.history = VideosService.getHistory();
          $log.info('Queued id:' + id + ' and title:' + title);
        };

        $scope.delete = function (list, id) {
          VideosService.deleteVideo(list, id);
          $scope.upcoming = VideosService.getUpcoming();
          // $scope.history = VideosService.getHistory();
        };

        $scope.search = function () {
          $http.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              key: 'AIzaSyAFjhfNevE7qWPwW7J4uEYZ1nbNMgh3lYY', // jgthms
              type: 'video',
              maxResults: '8',
              part: 'id,snippet',
              fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
              q: this.query
            }
          })
          .success( function (data) {
            VideosService.listResults(data);
            $log.info(data);
          })
          // .error( function () {snippetsnippet
          //   $log.info('Search error');
          // });
        }

        $scope.tabulate = function (state) {
          $scope.playlist = state;
        }

});
