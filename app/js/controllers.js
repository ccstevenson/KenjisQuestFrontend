'use strict';

/* Controllers */


angular.module('myApp.controllers', ['ngDragDrop'])

    .controller('RouteCtrl', ['$scope',
        function ($scope) {

        $scope.setSoundboard = function (boardVisible) {
            $scope.soundBoardVisible = boardVisible;
            console.log(boardVisible);
        };
    }])

    .controller('CharGenCtrl', ['$scope', 'Restangular', 'fireBase', 'characterService',
        function ($scope, Restangular, fireBase, characterService) {

        $scope.game = {};

        fireBase.$asObject().$bindTo($scope, "game");

        $scope.characterClasses = characterService.characterClasses;
        $scope.races = characterService.races;
        $scope.weapons = characterService.weapons;

        $scope.addImage = function(charClass) {
            if (charClass.name == 'Mage')  {
                return "img/char5_small.png";
            } else if (charClass.name == 'Rogue')  {
                return "img/char4_small.png";
            } else if (charClass.name == 'Summoner')  {
                return "img/char2_small.png";
            } else if (charClass.name == 'Cleric')  {
                return "img/char3_small.png";
            } else if (charClass.name == 'Warrior')  {
                return "img/char1_small.png";
            } else  { //error handling
                return "img/error.png"
            }
        };

        $scope.healthMod = function(charClass, charRace)  {
            var healthModifier = 1.0;
            if (charClass.name == "Warrior")  {
                healthModifier += 0.15;
            } else if (charRace.name == "Halfling")  {
                healthModifier -= 0.1;
            } else if (charRace.name == "Dwarf")  {
                healthModifier += 0.35;
            }
            return healthModifier;
        };

        $scope.player = {};

        $scope.addPlayer = function() {

            $scope.player.sprite = $scope.addImage($scope.charClass);
            $scope.player.health = parseInt($scope.maxHealth);
            $scope.player.health = parseInt($scope.healthMod($scope.charClass, $scope.charRace) * $scope.player.health);
            $scope.player.maxHealth = $scope.player.health;
            $scope.player.class = $scope.charClass;
            $scope.player.race = $scope.charRace;
            $scope.player.silver = 30;
            $scope.player.color = $scope.color;
            $scope.player.weapon = $scope.weapon;
            $scope.player.inventory = characterService.inventory;
            $scope.player.skills = characterService.skills;

            function idGen(len) {
                var text = "";
                var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                for (var i = 0; i < len; i++)
                    text += charset.charAt(Math.floor(Math.random() * charset.length));
                return text;
            }

            if ($scope.game.players instanceof Array)  {
                $scope.player.id = idGen(10);
                $scope.game.players.push($scope.player);
                fireBase.$set({players: $scope.game.players}).then(function(){
                    setTimeout("window.location = '#/battleatronic';",250);
                });
            } else {
                $scope.player.id = idGen(10);
                $scope.game.players = {0: $scope.player};
                fireBase.$set({players: $scope.game.players}).then(function(){
                   setTimeout("window.location = '#/battleatronic';",250);
                });
            }
        };
    }])

    .controller('RoleCtrl', ['$scope', 'roleService',
        function ($scope, roleService) {

        $scope.Role = roleService;
        $scope.roles = roleService.roles;

        $scope.selectRole = function (role) {
            roleService.role = role;

            if (role != "Game Master") {
                window.location = '#/battleatronic';
            }
        };
    }])

    .controller('GameCtrl', ['$scope', 'Restangular', 'fireBase',
        function ($scope, Restangular, fireBase) {

            $scope.game = {};
            Restangular.all('games').getList().then(function (games) {
                $scope.games = games;
                fireBase.$asObject().$bindTo($scope, "game").then(function(){
                    if ($scope.game.currentGame != null) {
                        $scope.newGame = $scope.games[$scope.game.currentGame];
                    }
                });
            });

            $scope.selectGame = function (game) {
                $scope.newGame = game;
                game = $scope.games.indexOf(game);
                fireBase.$set("currentGame", game);
                $scope.chapter = {};
            };

            $scope.selectChapter = function (chapter) {
                $scope.chapter = chapter;
                $scope.scenario = {};
            };

            $scope.selectScenario = function (scenario) {
                fireBase.$set("scenario", scenario).then(function(){
                setTimeout("window.location = '#/scenario';",250);
                });
            };
        }])

    .controller('ScenarioCtrl', ['$scope', 'fireBase',
        function ($scope, fireBase) {

            $scope.game = {};
            fireBase.$asObject().$bindTo($scope, "game").then(function(){
                $scope.players = $scope.game.players;
                $scope.scenario = $scope.game.scenario;
                $scope.encounters = $scope.scenario.encounters;
                if ($scope.game.currentEncounter != null) {
                    $scope.encounter = $scope.scenario.encounters[$scope.game.currentEncounter];
                    $scope.items = $scope.encounter.items;
                    $scope.characters = $scope.encounter.characters;
                }
            });

            $scope.deleteCharacter = function(character){
                for (var i = 0; i < $scope.game.players.length; i++) {
                    if ($scope.game.players[i].id == character.id) {
                        $scope.game.players[i] = null; // Two stage deletion process: object then reference.
                        delete $scope.game.players[i]; // FireBase updates based on $scope
                        break;
                    }
                }

                if ($scope.game.players.length > 0) {
                    var players = [];
                    for (var player in $scope.game.players) {
                         var playerIndex = parseInt(player);
                         players.push($scope.game.players[playerIndex]);
                    }
                    $scope.game.players = players; // reset scope and firebase to rebuild index
                }
            };

            var changeSilver = function(character) {
                for (var player in $scope.game.players) {
                    var playerIndex = parseInt(player);
                    if (character.id == $scope.game.players[playerIndex].id) {
                        $scope.game.players[playerIndex].silver = character.silver;
                    }
                }
            };

            $scope.addSilver = function(character) {
                character.silver ++;
                changeSilver(character);
            };

             $scope.subtractSilver = function(character) {
                character.silver --;
                changeSilver(character);
            };

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
            };

            $scope.launchEncounter = function (encounter) {
                fireBase.$set("enemies", encounter.characters);
                fireBase.$set("currentEncounter", $scope.scenario.encounters.indexOf(encounter)).then(function(){
                    setTimeout("window.location = '#/battleatronic';",250);
                });
            };
        }])

    .controller('BattleatronicCtrl', ['$scope', 'fireBase',
        function ($scope, fireBase) {

            $scope.ENEMYCONST = 'enemy';
            $scope.PLAYERCONST ='player';

            $scope.game = {};
            fireBase.$asObject().$bindTo($scope, "game").then(function() {
                $scope.game.soundPlay = false;
                $scope.beastCardShow = false;
            });

            $scope.selectedPlayer = function (player) {
                $scope.game.selections.activeActor = player; // Perhaps have the computer automatically set active based on actions taken.
            };

            $scope.selectedEnemy = function (target) {
                $scope.game.selections.activeTarget = target;
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
                else if (status == 'healAll' && character.health > 0) {
                    $scope.game.sound = 'sounds/heal.mp3';
                }
                else if (status == 'miss') {
                    $scope.game.sound = 'sounds/miss.mp3';
                }

                var targets = $scope.game.enemies;
                var targetType = $scope.game.enemies;

                var dealDamage = function (target) {
                    // set target type; enemy or player
                    for (var player in $scope.game.players){
                        var playerIndex = parseInt(player);
                        if ($scope.game.players[playerIndex].id == target.id) {
                            targetType = $scope.game.players;
                            break;
                        }
                    }
                    // deal damage to target(s)
                    for (var enemy in targetType){
                        var playerIndex = parseInt(enemy);
                        if (targetType[playerIndex].id == target.id) {
                            target = targetType[playerIndex];
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

                    // set to false in the calculator
                    // directive, in a watch
                    target.rumble = true;

                };

                if (status == 'attackAll' || status == 'healAll') {
                    for (var player in $scope.game.players){
                        var playerIndex = parseInt(player);
                        if ($scope.game.players[playerIndex].id == character.id) {
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

                // The attack was completed. Deselect the two characters involved in the attack.
                $scope.game.selections.activeActor = null;
                $scope.game.selections.activeTarget = null;
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

    .controller('VideosController',
    function ($scope, $http, $log, VideosService) {

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
