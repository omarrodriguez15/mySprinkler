'use strict';

angular.module('fullStackTestApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $location, $cookieStore) {
    $scope.errors = {};

    if(!$cookieStore.get('token')) {
      $location.path('/login');
    }

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.changeEmail = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        // change email
      }
    };
  });
