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
    'restangular'
]).
    config(['$routeProvider', 'RestangularProvider', function ($routeProvider, RestangularProvider) {
        $routeProvider.when('/battleatronic', {templateUrl: 'partials/battleatronic.html', controller: 'BattleatronicCtrl'});
        $routeProvider.when('/soundboard', {templateUrl: 'partials/soundboard.html', controller: 'SoundboardCtrl'});
        $routeProvider.when('/gm-view', {templateUrl: 'partials/gm-view.html', controller: 'GmViewCtrl'});
        $routeProvider.otherwise({redirectTo: '/battleatronic'});

        RestangularProvider.setBaseUrl('http://127.0.0.1:8001');
    }]);