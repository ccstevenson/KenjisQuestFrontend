'use strict';

/* Controllers */


angular.module('myApp.controllers', ['ngDragDrop'])

    .controller('RouteCtrl', ['$scope', function ($scope) {
        $scope.setSoundboard = function (boardVisible) {
            $scope.soundBoardVisible = boardVisible;
            console.log(boardVisible);
        };
    }])

    .controller('CharGenCtrl', ['$scope', 'Restangular', 'fireBase',
        function ($scope, Restangular, fireBase) {

        $scope.game = {};

        fireBase.$asObject().$bindTo($scope, "game");

        $scope.characterClasses = [
            { printed_name: 'Mage', stored_name: 'mage' },
            { printed_name: 'Summoner', stored_name: 'summoner' },
            { printed_name: 'Warrior', stored_name: 'warrior' },
            { printed_name: 'Cleric', stored_name: 'cleric' },
            { printed_name: 'Rogue', stored_name: 'rogue' }];

        $scope.races = [
            { printed_name: 'Goblin', stored_name: 'goblin' },
            { printed_name: 'Human', stored_name: 'human' },
            { printed_name: 'Elf', stored_name: 'elf' },
            { printed_name: 'Halfling', stored_name: 'halfling' },
            { printed_name: 'Dwarf', stored_name: 'dwarf' }];


        $scope.player = {};
        // $scope.maxHealth = 0;

        $scope.addImage = function(charClass) {
            if (charClass == 'mage')  {
                return "img/char5_small.png";
            }
            else if (charClass == 'rogue')  {
                return "img/char4_small.png";
            }
            else if (charClass == 'summoner')  {
                return "img/char2_small.png";
            }
            else if (charClass == 'cleric')  {
                return "img/char3_small.png";
            }
            else if (charClass == 'warrior')  {
                return "img/char1_small.png";
            }
            else  {
                // this shouldn't be seen
                return "img/error.png"
            }
        };


        $scope.healthMod = function(charClass, charRace)  {
            var healthModifier = 1.0;
            if (charClass == "warrior")  {
                healthModifier += 0.15;
            }
            if (charRace == "halfling")  {
                healthModifier -= 0.1;
            }
            else if (charRace == "dwarf")  {
                healthModifier += 0.35;
            }
            return healthModifier;
        };

        $scope.addPlayer = function() {

            $scope.player.health = parseInt($scope.maxHealth);
            $scope.player.health = $scope.healthMod($scope.player.charClass, $scope.player.race) * $scope.player.health;
            $scope.player.maxHealth = $scope.player.health;
            $scope.player.sprite = $scope.addImage($scope.player.charClass);

            if ($scope.game.players instanceof Array)  {
                $scope.player.id = $scope.game.players.length + 1;
                $scope.game.players.push($scope.player);
                fireBase.$set({players: $scope.game.players}).then(function(){
                    window.location = '#/battleatronic';
                });
            }
            else {
                $scope.player.id = 1;
                $scope.game.players = [$scope.player];
                fireBase.$set({players: $scope.game.players}).then(function(){
                    window.location = '#/battleatronic';
                });
            }
        };


//            if (!($scope.game.players instanceof Array)) {
//                $scope.player.id = 1;
//                $scope.game.players = [$scope.player];
//            }
//            else  {
//                $scope.player.id = $scope.game.players.length + 1;
//                $scope.game.players.push($scope.player)
//            }
//            window.location = '#/battleatronic';
//        };


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

    .controller('ScenarioCtrl', ['$scope', 'encounterService', 'fireBase',
        function ($scope, encounterService, fireBase) {

            $scope.game = {};
            fireBase.$asObject().$bindTo($scope, "game").then(function(){
                if ($scope.game.scenario) {
                    encounterService.game = $scope.game;
                }
                $scope.scenario = encounterService.game.scenario;
                $scope.encounters = $scope.scenario.encounters;
                $scope.items = encounterService.items;
                $scope.characters = encounterService.characters;
            });

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

            $scope.game = {};
            fireBase.$asObject().$bindTo($scope, "game").then(function(){
                if (roleService.role != 'Player') {
                    $scope.game = encounterService.game;
                }
            });

            $scope.game.soundPlay = false;

            $scope.beastCardShow = false;

            if (roleService.role == 'Game Master' || roleService.role == 'Beast Master') {

            }

            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
            };

            $scope.calculateDamage = function (damage, character, status) {
                $scope.game.soundPlay = !$scope.game.soundPlay;

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
                else if (status == 'attackAll' && character.health > 0) {
                    $scope.game.sound = 'sounds/attack.mp3';
                }
                else if (status == 'heal') {
                    $scope.game.sound = 'sounds/heal.mp3';
                }
                else if (status == 'miss') {
                    $scope.game.sound = 'sounds/miss.mp3';
                }

                var targets = $scope.game.enemies;
                var targetType = $scope.game.enemies;

                var dealDamage = function (target) {

                    for (var player in $scope.game.players){
                        var playa = parseInt(player);
                        if ($scope.game.players[playa].id == target.id) {
                            targetType = $scope.game.players;
                            break;
                        }
                    }

                    for (var enemy in targetType){
                        var playa = parseInt(enemy);
                        if (targetType[playa].id == target.id) {
                            target = targetType[playa];
                            break;
                        }
                    }

                    if (target != null) {
                       target.health -= damage;

                        if (target.health < 0) { // Negative health disallowed.
                            target.health = 0;
                        }
                        else if (target.health > target.maxHealth) {
                            target.health = target.maxHealth;
                        }
                    }
                };

                if (status == 'attackAll') {
                    for (var player in $scope.game.players){
                        var playa = parseInt(player);
                        if ($scope.game.players[playa].id == character.id) {
                            targets = $scope.game.players;
                            break;
                        }
                    }
                    for (var target in targets) {
                        dealDamage(targets[target]);
                    }
                } else {
                    dealDamage(character);
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
                encounterService.game.players = [];
                $scope.game.players = encounterService.game.players;
                // encounterService.game.players = $scope.game.players;
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
