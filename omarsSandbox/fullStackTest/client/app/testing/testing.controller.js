'use strict';

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http, $location, $cookieStore) {
    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      console.log(awesomeThings);
    });
    
    $scope.delete = Modal.confirm.test(function(user){});
    
  });
