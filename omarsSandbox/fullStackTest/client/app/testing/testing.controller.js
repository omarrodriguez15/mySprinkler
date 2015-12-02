'use strict';

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http, $location, $cookieStore, Auth) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }
    //Grab user info stored in cookie
    var user = Auth.getCurrentUser();
    console.log(user);

    var d = new Date();
    var day;

    if(d.getDay() === 0) {
      day = 'sunday';
    } else if(d.getDay() === 1) {
      day = 'monday';
    } else if(d.getDay() === 2) {
      day = 'tuesday';
    } else if(d.getDay() === 3) {
      day = 'wednesday';
    } else if(d.getDay() === 4) {
      day = 'thursday';
    } else if(d.getDay() === 5) {
      day = 'friday';
    } else if(d.getDay() === 6) {
      day = 'saturday';
    } 

    $scope.zones = [];

    $http.get('/api/schedules/'+user.schedId)
      .success(function(res) {
        res[day].status = ['0', '1', '0', '0', '1', '1'];  //THIS IS WHAT IS EXPECTED
        
        var status = [];

        for(var i in res[day].status) {
          if(res[day].status[i] === '0') {
            status.push('OFF');
          } else {
            status.push('ON');  
          }
        }

        console.log(status);
        for(var j in status) {
          $scope.zones.push({
            number: Number(j) + 1,
            status: status[j]
          });
        }

        console.log($scope.zones);
      });

    $scope.turnOff = function() {
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
