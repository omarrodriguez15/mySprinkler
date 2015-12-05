'use strict';

var week = [
  {
    day:'Monday',
    enable: false
  },
  {
    day:'Tuesday',
    enable: false
  },
  {
    day:'Wednesday',
    enable: false
  },
  {
    day:'Thursday',
    enable: true
  },
  {
    day:'Friday',
    enable: false
  },
  {
    day:'Saturday',
    enable: true
  },
  {
    day:'Sunday',
    enable: true
  }
];
      
var times = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00',
  '10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00',
  '20:00','21:00','22:00', '23:00'];
        
function createScheduleArray(sched, cb){
  var newWeek = week;
  for(var i = 0; i < week.length ; i++){
    var day = week[i].day.toString().toLowerCase();
    
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
    Auth.isLoggedInAsync(function(loggedIn){
      if(!loggedIn){
        $location.path('/login');  
      }
    });
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

    $scope.defaults = function() {
      console.log('Reverted to defaults');
    };

    $scope.submit = function() {
      var newschedule = {
        monday: {
          start: '',
          end: '',
          status: ''
        },
        tuesday: {
          start: '',
          end: '',
          status: ''
        },
        wednesday: {
          start: '',
          end: '',
          status: ''
        },
        thursday: {
          start: '',
          end: '',
          status: ''
        },
        friday: {
          start: '',
          end: '',
          status: ''
        },
        saturday: {
          start: '',
          end: '',
          status: ''
        },
        sunday: {
          start: '',
          end: '',
          status: ''
        }
      };

      for(var day in week) {
        newschedule[week[day].day.toLowerCase()].start = week[day].start;
        newschedule[week[day].day.toLowerCase()].end = week[day].end;
        //newschedule[week[day].day.toLowerCase()]['status'] = week[day].status;
        newschedule[week[day].day.toLowerCase()].status = '0';
      }    

      $http.put('/api/schedules/' + user.schedId, newschedule)
        .success(function() {
          $http.post('/api/pis/email/', {
            email: user.email,
            body: JSON.stringify(newschedule) 
          }).success(function(res) {
            console.log(res);
          });
          console.log('Schedule saved successfully.');
        });
    };
  });