'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

    .controller('RouteCtrl', ['$scope', function ($scope) {
        $scope.setSoundboard = function (boardVisible) {
            $scope.soundBoardVisible = boardVisible;
            console.log(boardVisible);
        };

    }])

    .controller('CharacterCreationController', ['$scope', function ($scope) {

        $scope.addCharacter = function () {
            $scope.characters.$add({from: $scope.user, content: $scope.character});
            $scope.message = "";
        };
    }])

    .controller('RoleCtrl', ['$scope', 'roleService', function ($scope, roleService) {
        $scope.Role = roleService;
        $scope.roles = roleService.roles;

        $scope.selectRole = function (role) {
            roleService.role = role;

            if (role != "Game Master") {
                window.location = '#/battleatronic';
            }
        };
    }])


    .controller('GameCtrl', ['$scope', 'Restangular', 'encounterService',
        function ($scope, Restangular, encounterService) {

            Restangular.all('games').getList().then(function (games) {
                $scope.games = games;
            });

            $scope.selectGame = function (game) {
                $scope.game = game;

                var players = [];
                for (var player in game.players) {
                    players.push(game.players[player].character);
                }

                encounterService.players = players;
                $scope.chapter = {};
            };

            $scope.selectChapter = function (chapter) {
                $scope.chapter = chapter;
                $scope.scenario = {};
            };

            $scope.selectScenario = function (scenario) {
                encounterService.game.scenario = scenario;
                window.location = '#/scenario';
            };
        }])

    .controller('ScenarioCtrl', ['$scope', 'encounterService',
        function ($scope, encounterService) {

            $scope.scenario = encounterService.game.scenario;

            $scope.encounters = $scope.scenario.encounters;
            $scope.items = encounterService.items;
            $scope.characters = encounterService.characters;

            $scope.selectEncounter = function (encounter) {
                $scope.encounter = encounter;
                $scope.items = encounter.items;
                $scope.characters = encounter.characters;
            };

            $scope.launchEncounter = function (encounter) {
                encounterService.items = encounter.items;
                encounterService.characters = encounter.characters;
                encounterService.game.players = encounterService.players;
                encounterService.game.enemies = encounterService.characters;
                window.location = '#/battleatronic';
            };
        }])

    .controller('BattleatronicCtrl', ['$scope', 'GameService', 'encounterService',
        function ($scope, GameService, encounterService) {

            $scope.soundPlay = false
            $scope.game = encounterService.game;
            GameService.$bind($scope, "game");

            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
            };

            $scope.dealDamage = function (damage, character) {

                // if (damage > 0) {
                //     $scope.soundPlay = !$scope.soundPlay;
                //     $scope.sound = 'sounds/attack.ogg';
                // }
                // if (damage < 0) {
                //     $scope.soundPlay = !$scope.soundPlay;
                //     $scope.sound = 'sounds/heal.ogg';
                // }
                // console.log($scope.soundPlay);
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
            }



//        $scope.user = "Guest " + Math.round(Math.random() * 101);
//        $scope.game = GameService;
//        $scope.$add({game: null});

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

        $scope.runPlaySound = function (soundPath) {
            // $.playSound(soundPath);
            var audio = new Audio(soundPath);
            audio.play();
        };

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
                .success(function (data) {
                    VideosService.listResults(data);
                    $log.info(data);
                });
            // .error( function () {snippetsnippet
            //   $log.info('Search error');
            // });
        };

        $scope.tabulate = function (state) {
            $scope.playlist = state;
        }
    });
