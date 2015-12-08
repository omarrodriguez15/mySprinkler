'use strict';

var days = ['sunday','monday','tuesday','wednesday','thursday','friday', 'saturday'];
var currentDate = new Date();
var daySchedObj = {};

angular.module('fullStackTestApp')
  .controller('TestingCtrl', function ($scope, Modal, $http, $location, $cookieStore, Auth) {
    Auth.isLoggedInAsync(function(loggedIn){
      if(!loggedIn){
        $location.path('/login');  
      }
    });
        
    //Grab user info stored in cookie
    var user = Auth.getCurrentUser();
    console.log(user);
    var day = days[currentDate.getDay()];

    $scope.zones = [];

    $http.get('/api/schedules/'+user.schedId)
      .success(function(res) {
        var status = [];
        daySchedObj[day] = res[day];

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
    //$scope.delete = Modal.confirm.test(function(user){});
    
  })
  .directive('mainToggle', function(Auth, $http) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var zone = JSON.parse(attrs.mainToggle);

				var user = Auth.getCurrentUser();
    			console.log(user);

				element.bootstrapToggle(zone.status.toLowerCase());
				element.on('change', function() {
					zone = JSON.parse(attrs.mainToggle);
					var day = days[currentDate.getDay()];
					
					if(zone.status === 'OFF') {
						daySchedObj[day].status = '1';
            console.log('daySchedObj : '+JSON.stringify(daySchedObj));
      
						$http.put('/api/schedules/'+user.schedId, daySchedObj).success(function(res) {
							if (res.length < 1) {
							  return console.log('no schedule found!');
							}

							scope.schedule = res;
							console.log(res);
						});

						scope.zones[Number(zone.number) - 1].status = 'ON';
					} else {
            daySchedObj[day].status = '0';
						console.log('daySchedObj : '+JSON.stringify(daySchedObj));
						
						$http.put('/api/schedules/'+user.schedId, daySchedObj).success(function(res) {
							if (res.length < 1) {
							  return console.log('no schedule found!');
							}

							scope.schedule = res;
							console.log(res);
						});

						scope.zones[Number(zone.number) - 1].status = 'OFF';
					}

					scope.$apply();
				});
			}
		};
	});
