'use strict';

angular.module('fullStackTestApp')
	.directive('mainToggle', function() {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var zone = JSON.parse(attrs.mainToggle);

				element.bootstrapToggle(zone.status.toLowerCase());
				element.on('change', function() {
					if(scope.status === 'OFF') {
						scope.status = 'ON';
					} else {
						scope.status = 'OFF';
					}

					scope.$apply();
				});
			}
		};
	});