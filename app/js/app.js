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
    'LocalStorageModule'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/battleatronic', {templateUrl: 'partials/battleatronic.html', controller: 'BattleatronicCtrl'});
        $routeProvider.when('/soundboard', {templateUrl: 'partials/soundboard.html', controller: 'VideosController'});
        $routeProvider.otherwise({redirectTo: '/battleatronic'});
    }]);


angular.module('myApp').run(function () {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});