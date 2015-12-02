'use strict';

angular.module('fullStackTestApp')
	.directive('mainToggle', function(Auth, $http) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var zone = JSON.parse(attrs.mainToggle);
				var today;

				var user = Auth.getCurrentUser();
    			console.log(user);

				element.bootstrapToggle(zone.status.toLowerCase());
				element.on('change', function() {
					if(scope.status === 'OFF') {
						today = {sunday:{start: '15:00', end:'16:00',status:'1'}};
      
						$http.put('/api/schedules/'+user.schedId, today).success(function(res) {
							if (res.length < 1) {
							  return console.log('no schedule found!');
							}

							scope.schedule = res;
							console.log(res);
						});

						scope.status = 'ON';
					} else {
						today = {sunday:{start: '15:00', end:'16:00',status:'0'}};
						$http.put('/api/schedules/'+user.schedId, today).success(function(res) {
							if (res.length < 1) {
							  return console.log('no schedule found!');
							}

							scope.schedule = res;
							console.log(res);
						});

						scope.status = 'OFF';
					}

					scope.$apply();
				});
			}
		};
	});