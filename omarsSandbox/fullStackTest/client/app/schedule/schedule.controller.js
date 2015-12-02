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
        console.log(week[day]);
        newschedule[week[day].day.toLowerCase()]['start'] = week[day].start;
        newschedule[week[day].day.toLowerCase()]['end'] = week[day].end;
        //newschedule[week[day].day.toLowerCase()]['status'] = week[day].status;
        newschedule[week[day].day.toLowerCase()]['status'] = '0';
      }    

      console.log(newschedule);
      $http.put('/api/schedules/' + user.schedId, newschedule)
        .success(function() {
          console.log("Schedule saved successfully.")
        });
    }
  });