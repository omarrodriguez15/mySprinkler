'use strict';

var week = [
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
      
var times = ['12:00 AM','01:00 AM','02:00 AM','03:00 AM','04:00 AM','05:00 AM','06:00 AM','07:00 AM','08:00 AM','09:00 AM',
        '10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM',
        '08:00 PM','09:00 PM','10:00 PM', '11:00 PM'];
        
function createScheduleArray(sched, cb){
  var newWeek = week;
  for(var i = 0; i < week.length ; i++){
    var day = week[0].day.toString().toLowerCase();
    
    newWeek[i].start = sched[day].start;
    newWeek[i].end = sched[day].end;
  }
  //send back new week object
  cb(newWeek);
}
        
        
angular.module('fullStackTestApp')
  .controller('ScheduleCtrl', function ($scope, $location, $cookieStore, $http, Auth, $route) {
    $scope.noPi = false;
    
    //check if user is logged in
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }
    
    //Grab user info stored in cookie
    var user = Auth.getCurrentUser();
    console.log(user);
    
    if (user.piId === '' ){
      $scope.noPi = true;
      $scope.register = function(txtPiId){
        console.log('passed value: '+txtPiId);
        $http.put('/api/publicUsers/'+user._id,{piId : txtPiId}).success(function(res){
          console.log('res: '+res);
          console.log('success');
          $route.reload();
        });
      };
    }
    else{
      $http.get('/api/schedules/'+user.schedId).success(function(res) {
        if (res.length < 1) {
          return console.log('no schedule found!');
        }
        console.log(res);
        
        createScheduleArray(res, function(newWeek){
          $scope.times = times;
          console.log('neweek: '+JSON.stringify(newWeek));
          $scope.week = newWeek;
        });
        
      });
    }
  });