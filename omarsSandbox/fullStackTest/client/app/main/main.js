'use strict';

angular.module('fullStackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

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
	})