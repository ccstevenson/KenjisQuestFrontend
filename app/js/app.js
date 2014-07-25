'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'firebase',
    'ui.bootstrap',
    'LocalStorageModule',
    'restangular'
])
    .config(['$routeProvider', 'RestangularProvider', function ($routeProvider, RestangularProvider) {
        $routeProvider.when('/battleatronic', {templateUrl: 'partials/battleatronic.html', controller: 'BattleatronicCtrl'});
        $routeProvider.when('/soundboard', {templateUrl: 'partials/soundboard.html', controller: 'VideosController'});
        $routeProvider.when('/load-game', {templateUrl: 'partials/load-game.html', controller: 'GameCtrl'});
        $routeProvider.when('/scenario', {templateUrl: 'partials/scenario.html', controller: 'ScenarioCtrl'});
        $routeProvider.otherwise({redirectTo: '/battleatronic'});

        RestangularProvider.setBaseUrl('http://127.0.0.1:8000');
    }])

    .run(function () {
     var tag = document.createElement('script');
     tag.src = "http://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});