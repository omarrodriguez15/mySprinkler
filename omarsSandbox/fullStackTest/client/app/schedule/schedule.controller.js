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
    newWeek[i].watertoday = sched[day].watertoday;
    newWeek[i].end = sched[day].end;
  }
  //send back new week object
  cb(newWeek);
}
        
        
angular.module('fullStackTestApp')
  .controller('ScheduleCtrl', function ($scope, $location, $cookieStore, $http, Auth, $window) {
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
          $window.location.reload();
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
          status: '',
          watertoday: ''
        },
        tuesday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        },
        wednesday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        },
        thursday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        },
        friday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        },
        saturday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        },
        sunday: {
          start: '',
          end: '',
          status: '',
          watertoday: ''
        }
      };

      for(var day in week) {
        newschedule[week[day].day.toLowerCase()].start = week[day].start;
        newschedule[week[day].day.toLowerCase()].end = week[day].end;
        newschedule[week[day].day.toLowerCase()].watertoday = week[day].watertoday;
        //newschedule[week[day].day.toLowerCase()]['status'] = week[day].status;
        newschedule[week[day].day.toLowerCase()].status = '0';
      }    

      $http.put('/api/schedules/' + user.schedId, newschedule)
        .success(function() {
          $http.post('/api/pis/email/', {
            email: user.email,
            body: JSON.stringify(newschedule) 
          }).success(function(res) {
            //Add some toast confirmming the save and email...
            
            console.log(res);
          });
          console.log('Schedule saved successfully.');
        });
    };
    
    $scope.defaults = function() {
      console.log('Revert to defaults');
      $http.put('/api/schedules/' + user.schedId, {
          monday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          tuesday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          wednesday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          thursday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          friday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          saturday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
          sunday:{
            start: '07:00',
            end: '08:00',
            status: '0',
            watertoday: true
          },
        })
        .success(function() {
          console.log('Schedule saved successfully.');
          $window.location.reload();
        });
    };
    
  });