'use strict';
var Tweek, Ttimes;
angular.module('fullStackTestApp')
  .controller('ScheduleCtrl', function ($scope, $location, $cookieStore, $http, Auth) {
    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }
    var user = Auth.getCurrentUser();
    console.log(user.schedId);
    $http.get('/api/schedules/'+user.schedId).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        
        $scope.schedule = res;
        console.log(res);
      });
    
    $scope.times = Ttimes;
    $scope.week = Tweek;
  });



//Dummy Data
Tweek = [
      {
        day:'Monday'
      },
      {
        day:'Tuesday'
      },
      {
        day:'Wednesday'
      },
      {
        day:'Thursday'
      },
      {
        day:'Friday'
      },
      {
        day:'Saturday'
      },
      {
        day:'Sunday'
      }
      ];
Ttimes = ['12:00 AM','01:00 AM','02:00 AM','03:00 AM','04:00 AM','05:00 AM','06:00 AM','07:00 AM','08:00 AM','09:00 AM',
        '10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM',
        '08:00 PM','09:00 PM','10:00 PM', '11:00 PM'];