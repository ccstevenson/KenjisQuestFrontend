'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('BattleatronicCtrl', ['$scope', 'FirebaseService', function($scope, FirebaseService) {
      $scope.user = "Guest " + Math.round(Math.random()*101);
      $scope.game = FirebaseService;

      $scope.addMessage = function() {
        $scope.messages.$add({from: $scope.user, content: $scope.message});
        $scope.message = "";
      };
        
  }]);
