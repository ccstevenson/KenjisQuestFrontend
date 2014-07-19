'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')
    .factory("FirebaseService", ["$firebase", function ($firebase) {
        var ref = new Firebase("https://scorching-fire-3218.firebaseio.com/chat");
        return $firebase(ref);
    }]);
