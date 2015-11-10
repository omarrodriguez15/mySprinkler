'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, $cookieStore, $location) {
    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }
    
    $scope.message = 'Hello';
    $scope.sprinklerOn = function() {
    	//sprinkleron
    };
  });
