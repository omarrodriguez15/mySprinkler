'use strict';

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http, $location, $cookieStore, Auth) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }
    //Grab user info stored in cookie
    var user = Auth.getCurrentUser();
    console.log(user);
    
    $scope.turnOff = function(){
      //should be able to use angular to get the today object
      //when the today param is fixed here it will need to be 
      //updated in the pi code too!!!
      var today = {sunday:{start: '15:00', end:'16:00',status:'0'}};
      
      $http.put('/api/schedules/'+user.schedId, today).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        
        $scope.schedule = res;
        console.log(res);
      });
    };
    
    $scope.turnOn = function(){
      var today = {sunday:{start: '15:00', end:'16:00',status:'1'}};
      
      $http.put('/api/schedules/'+user.schedId, today).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        
        $scope.schedule = res;
        console.log(res);
      });
    };
    
    //$scope.delete = Modal.confirm.test(function(user){});
    
  });
