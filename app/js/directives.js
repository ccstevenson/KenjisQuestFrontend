'use strict';

/* Directives */


angular.module('myApp.directives', [])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('characterCard', function () {
        return {
            restrict: 'E',
            scope: {
                character: '=character'
            },
            templateUrl: 'partials/character-card.html'
        }
    });
