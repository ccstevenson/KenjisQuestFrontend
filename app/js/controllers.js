'use strict';

/* Controllers */


angular.module('myApp.controllers', ['ngDragDrop'])

    .controller('RouteCtrl', ['$scope', function ($scope) {
        $scope.setSoundboard = function (boardVisible) {
            $scope.soundBoardVisible = boardVisible;
            console.log(boardVisible);
        };
    }])

<<<<<<< HEAD
    .controller('CharGenCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {
        $scope.characterClasses = [
            { printed_name: 'Wizard', stored_name: 'wizard' },
            { printed_name: 'Rogue', stored_name: 'rogue' },
            { printed_name: 'Warrior', stored_name: 'warrior' },
            { printed_name: 'Ranger', stored_name: 'ranger' }];

        $scope.races = [
            { printed_name: 'Goblin', stored_name: 'goblin' },
            { printed_name: 'Human', stored_name: 'human' },
            { printed_name: 'Elf', stored_name: 'elf' },
            { printed_name: 'Dwarf', stored_name: 'dwarf' }];


        // $scope.nationalities = [
        //     { printed_name: 'Bake', stored_name: 'bake' },
        //     { printed_name: 'Microwave', stored_name: 'microwave' },
        //     { printed_name: 'Fry', stored_name: 'fry' },
        //     { printed_name: 'Dutch Oven', stored_name: 'dutch_oven' }];

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

                encounterService.game.players = players;
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

            $scope.dropSuccessHandler = function ($event, index, array) {
                array.splice(index, 1);
            };
            $scope.onDrop = function ($event, $data, array) {
                array.push($data);
            };

            $scope.selectEncounter = function (encounter) {
                $scope.encounter = encounter;
                $scope.items = encounter.items;
                $scope.characters = encounter.characters;
                $scope.players = encounterService.game.players;
            };

            $scope.launchEncounter = function (encounter) {
                encounterService.items = encounter.items;
                encounterService.characters = encounter.characters;
                encounterService.game.enemies = encounterService.characters;
                window.location = '#/battleatronic';
            };
        }])

    .controller('BattleatronicCtrl', ['$scope', 'encounterService', 'fireBase', 'roleService',
        function ($scope, encounterService, fireBase, roleService) {

            if (roleService.role != 'Player') {
                $scope.game = encounterService.game;
            }

            fireBase.$bind($scope, "game");

            $scope.soundPlay = false;

            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
            };

            $scope.calculateDamage = function (damage, character, status) {
                $scope.soundPlay = !$scope.soundPlay;
                // $scope.game.sound = 'sounds/attack.ogg';

                // if (damage > 0) {
                //     $scope.soundPlay = !$scope.soundPlay;
                //     $scope.sound = 'sounds/attack.ogg';
                // }
                // if (damage < 0) {
                //     $scope.soundPlay = !$scope.soundPlay;
                //     $scope.sound = 'sounds/heal.ogg';
                // }

                // console.log($scope.soundPlay);

                if (status == 'attack' && character.health > 0) {
                    $scope.game.sound = 'sounds/attack.mp3';
                }

                else if (status == 'heal') {
                    $scope.game.sound = 'sounds/heal.mp3';
                }
                else if (status == 'miss') {
                    $scope.game.sound = 'sounds/miss.mp3';
                }

                if (character != null) {
                    character.health -= damage;

                    if (character.health < 0) { // Negative health disallowed.
                        character.health = 0;
                    }
                    else if (character.health > character.maxHealth) {
                        character.health = character.maxHealth;
                    }
                }

                encounterService.game.players = $scope.game.players;

                // The attack was completed. Deselect the two characters involved in the attack.
                $scope.game.selections.activeActor = null;
                $scope.game.selections.activeTarget = null;
            };

            $scope.makeSelection = function (player) {
                if (!$scope.game.selections || !$scope.game.selections.activeActor) {
                    $scope.game.selections = {
                        activeActor: player
                    };
                }
                else {
                    $scope.game.selections.activeTarget = player;
                }
            };

            $scope.deletePlayers = function () {
                $scope.game.players = [];
            };


            $scope.addPlayer = function(player) {
                if (typeof $scope.players != "undefined") {
                    $scope.players = [player];
                }
                else  {
                    $scope.players.push(player);
                }
            };


            $scope.$watch('game.soundPlay', function () {
                var audio = new Audio($scope.game.sound);
                // console.log(audio)
                audio.play();
            });


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
