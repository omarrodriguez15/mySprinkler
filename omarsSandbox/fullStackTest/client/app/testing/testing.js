'use strict';

angular.module('fullStackTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/testing', {
        templateUrl: 'app/testing/testing.html',
        controller: 'TestingCtrl'
      });
  });
