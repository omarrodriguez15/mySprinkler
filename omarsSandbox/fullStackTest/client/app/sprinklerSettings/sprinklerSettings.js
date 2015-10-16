'use strict';

angular.module('fullStackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sprinklerSettings', {
        templateUrl: 'app/sprinklerSettings/sprinklerSettings.html',
        controller: 'SprinklerSettingsCtrl'
      });
  });
