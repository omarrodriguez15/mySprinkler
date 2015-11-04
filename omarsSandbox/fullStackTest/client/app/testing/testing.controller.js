'use strict';

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http) {
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      console.log(awesomeThings);
    });
    
    $scope.delete = Modal.confirm.test(function(user){});
    
  });
