'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')

    .factory("GameService", ["$firebase", function ($firebase) {

        // May want to later replace "game" with the id for the game currently being played.
        // This id will be dynamically generated by the Django server and returned to all players joining that game.
        // We could add this id to the end of the game's URL so that games are easy to share: just paste the URL.
        var ref = new Firebase("https://scorching-fire-3218.firebaseio.com/game");
        return $firebase(ref);
    }])

    .factory("PlayerConstants", function () {

        var playerOne = {
            id: 1,
            name: 'Christopher',
            class: 'Warrior',
            sprite: 'img/char1_small.png',
            health: 25,
            maxHealth: 30
        };

        var playerTwo = {
            id: 2,
            name: 'Linsey',
            class: 'Warlock',
            sprite: 'img/char2_small.png',
            health: 20,
            maxHealth: 30
        };

        var playerThree = {
            id: 3,
            name: 'Bob',
            class: 'Rogue',
            sprite: 'img/char3_small.png',
            health: 10,
            maxHealth: 30
        };

        var playerFour = {
            id: 4,
            name: 'Samwise',
            class: 'Beastmaster',
            sprite: 'img/char4_small.png',
            health: 0,
            maxHealth: 30
        };

        var playerFive = {
            id: 5,
            name: 'Samus',
            class: 'Mage',
            sprite: 'img/char5_small.png',
            health: 22,
            maxHealth: 30
        };

        var players = [playerOne, playerTwo, playerThree, playerFour, playerFive];

        return players;
    })

    .factory("EnemyConstants", function () {

        var enemyOne = {
            id: 6,
            name: 'Rat',
            class: 'Warrior',
            sprite: 'img/rat_small.jpg',
            health: 25,
            maxHealth: 30
        };

        var enemyTwo = {
            id: 7,
            name: 'Rat',
            class: 'Warrior',
            sprite: 'img/rat_small.jpg',
            health: 8,
            maxHealth: 30
        };

        var enemyThree = {
            id: 8,
            name: 'Ghost',
            class: 'Mage',
            sprite: 'img/ghost_small.jpg',
            health: 25,
            maxHealth: 30
        };

        var enemyFour = {
            id: 9,
            name: 'Wasp',
            class: 'Rogue',
            sprite: 'img/wasp_small.jpg',
            health: 25,
            maxHealth: 30
        };
        var enemyFive = {
            id: 10,
            name: 'Wasp',
            class: 'Rogue',
            sprite: 'img/wasp_small.jpg',
            health: 25,
            maxHealth: 30
        };

        var enemies = [enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive];

        return enemies;
    });
