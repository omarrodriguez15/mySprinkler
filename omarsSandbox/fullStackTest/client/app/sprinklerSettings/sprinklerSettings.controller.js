'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, $cookieStore, Modal) {
    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }

    $scope.submit = function(form) {
    	console.log("haha");
    };

    $(function(){
		$('#zones').slider({
		      formatter: function(value) {
		        return (value);
		      }
		});

		$('#threshold').slider({
			formatter: function(value) {
				return (value + ' in');
			}
		})
	});
  });
