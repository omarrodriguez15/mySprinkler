'use strict';

angular.module('fullStackTestApp')
  .controller('MainCtrl', function ($scope, $http, Auth, socket, $location) {
    $scope.awesomeThings = [];

    Auth.isLoggedInAsync(function(loggedIn){
      if(!loggedIn){
        $location.path('/login');  
      }
    });
    var user = Auth.getCurrentUser();
    $scope.city = user.city;
    console.log(user);

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
    
    $http.get('/api/condweather/latest').success(function(condWeather) {
      console.log('res: '+ JSON.stringify(condWeather));
      //$scope.temp = condWeather.temp;
      //$scope.icon = condWeather.icon;
    });



    //replace with http get current status of sprinkler
    $scope.status = 'ON';
    //end http get

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });   
  });
