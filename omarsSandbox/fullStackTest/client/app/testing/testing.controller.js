'use strict';

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http, $location, $cookieStore, Auth) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }
    
    $scope.turnOff = function(){
      //hardcoded schedule id for now 
      var id = '56311278f574e10478ddc097';
      var today = {sunday:{start: '15:00', end:'16:00',status:'0'}};
      
      $http.put('/api/schedules/'+id, today).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        
        $scope.schedule = res;
        console.log(res);
      });
    };
    
    $scope.turnOn = function(){
      //hardcoded schedule id for now 
      var id = '56311278f574e10478ddc097';
      var today = {sunday:{start: '15:00', end:'16:00',status:'1'}};
      
      $http.put('/api/schedules/'+id, today).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        
        $scope.schedule = res;
        console.log(res);
      });
    };
    
    //$scope.delete = Modal.confirm.test(function(user){});
    
  });
