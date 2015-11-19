'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, $cookieStore, Auth, Modal, $http) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }

    var user = Auth.getCurrentUser();
    console.log(user);
    
    $('#numberofzones').slider({
      formatter: function(value) {
        return (value);
      }
    });

    $('#wateringthreshold').slider({
      formatter: function(value) {
        return (value + ' in');
      }
    });

    $http.get('/api/settings/'+user.settingId).success(function(res) {
      if (res.length < 1) {
        return console.log('no settings found!');
      }

      updateSettings(res);
    });

    $scope.submit = function(form) {
      $scope.submitted = true;
      console.log($('wateringtype').val());
      if(form.$valid) {
        $http.put('/api/settings/'+user.settingId, {
            wateringtype : $("#wateringtype").val(),
            numberofzones : $("#numberofzones").val(),
            wateringthreshold : $("#wateringthreshold").val(),
            soiltype : $("#soiltype").val(),
            planttype : $("#planttype").val(),
            shadedarea : $("#shadedarea").prop("checked"),
            slopedarea : $("#slopedarea").prop("checked") 
          })
          .success(function(res) {
            $scope.message = 'Settings saved successfully.';
          });
      }
    };

    function updateSettings(settings) {
        $("#wateringtype").val(settings.wateringtype);
        $("#numberofzones").slider('setValue', Number(settings.numberofzones));
        $("#wateringthreshold").slider('setValue', Number(settings.wateringthreshold));
        $("#soiltype").val(settings.soiltype);
        $("#planttype").val(settings.planttype);
        $("#shadedarea").prop("checked", settings.shadedarea);
        $("#slopedarea").prop("checked", settings.slopedarea);
    }
  });
