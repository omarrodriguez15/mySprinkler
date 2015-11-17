'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, $cookieStore, Auth, Modal) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }

    var user = Auth.getCurrentUser();
    console.log(user);
    
    $http.get('/api/settings/'+user.settingId).success(function(res) {
      if (res.length < 1) {
        return console.log('no settings found!');
      }
      console.log(res);
      
      settings(res);
    });

    function settings(settings) {
    	
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
