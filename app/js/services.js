'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')

    .factory("GameService", ["$firebase", function ($firebase) {

        // May want to later replace "game" with the id for the game currently being played.
        // This id will be dynamically generated by the Django server and returned to all players joining that game.
        var ref = new Firebase("https://scorching-fire-3218.firebaseio.com/game");
        return $firebase(ref);
    }])

    .factory("CharacterConstants", function () {

        var characterOne = {
            name: 'Christopher',
            class: 'Cleric',
            sprite: 'img/zelda.png'
        };

        var characterTwo = {
            name: 'Linsey',
            class: 'Warrior',
            sprite: 'img/zelda.png'
        };

        var characterThree = {
            name: 'Bob',
            class: 'Warlock',
            sprite: 'img/zelda.png'
        };

        var characterFour = {
            name: 'Samwise',
            class: 'Hobbit',
            sprite: 'img/zelda.png'
        };

        var characterFive = {
            name: 'Samus',
            class: 'Power Suit',
            sprite: 'img/zelda.png'
        };

        var characters = [characterOne, characterTwo, characterThree, characterFour, characterFive];

        return characters;
    });
