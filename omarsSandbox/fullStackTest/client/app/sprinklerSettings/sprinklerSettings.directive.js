'use strict';

angular.module('fullStackTestApp')
	.directive('wateringThreshold', function() {
		return {
			restrict: 'A',
			link: function (scope, element) {
				element.on('change', function() {
					if(element.val() === 'Custom') {
						console.log(element.val());
						scope.customThreshold = true;
					} else {
						scope.customThreshold = false;
					}

					scope.$apply();
				});
			}
		};
	});