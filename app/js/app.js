'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'firebase',
    'ui.bootstrap'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/battleatronic', {templateUrl: 'partials/battleatronic.html', controller: 'BattleatronicCtrl'});
        $routeProvider.when('/soundboard', {templateUrl: 'partials/soundboard.html', controller: 'SoundboardCtrl'});
        $routeProvider.otherwise({redirectTo: '/battleatronic'});
    }]);
