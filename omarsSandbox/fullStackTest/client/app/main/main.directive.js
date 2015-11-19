angular.module('fullStackTestApp')
	.directive('mainToggle', function() {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bootstrapToggle(scope.status.toLowerCase());
				element.on('change', function() {
					if(scope.status == 'OFF') {
						scope.status = 'ON';
					} else {
						scope.status = 'OFF';
					}

					scope.$apply();
				});
			}
		};
	});

angular.module('fullStackTestApp')
	.directive('weather', function() {
		return {
			restrict: 'E',
			link: function (scope, element, attrs) {
				element.weatherfeed(['UKXX0085','EGXX0011','UKXX0061','CAXX0518','CHXX0049']);
			}
		};
	});