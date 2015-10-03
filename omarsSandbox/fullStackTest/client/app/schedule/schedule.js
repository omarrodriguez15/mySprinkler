'use strict';

angular.module('fullStackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/schedule', {
        templateUrl: 'app/schedule/schedule.html',
        controller: 'ScheduleCtrl'
      });
  });
