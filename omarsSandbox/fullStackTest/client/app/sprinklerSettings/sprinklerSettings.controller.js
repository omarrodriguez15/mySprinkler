'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, $cookieStore) {
    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }
    
    $scope.message = 'Hello';
    $scope.sprinklerOn = function() {
    	//sprinkleron
    }
  });
