'use strict';

angular.module('fullStackTestApp')
	.directive('weather', function() {
		return {
			restrict: 'E',
			link: function (scope, element) {
				element.weatherfeed(['UKXX0085','EGXX0011','UKXX0061','CAXX0518','CHXX0049']);
			}
		};
	});