'use strict';

angular.module('fullStackTestApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window, $cookieStore) {
    $scope.user = {};
    $scope.errors = {};

    if($cookieStore.get('token')) {
      $location.path('/');
    }

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          address: $scope.user.address,
          city: $scope.user.city,
          state: $scope.user.state,
          cord:{lat:'',lon:''},
          schedId: '',
          settingId: '',
          piId: '',
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
