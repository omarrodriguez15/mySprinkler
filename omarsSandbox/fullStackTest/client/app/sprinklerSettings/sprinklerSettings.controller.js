'use strict';

angular.module('fullStackTestApp')
  .controller('SprinklerSettingsCtrl', function ($scope, Auth, Modal, $http, $location) {
    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }

    var user = Auth.getCurrentUser();
    console.log(user);
    
    jQuery('#numberofzones').slider({
      formatter: function(value) {
        return (value);
      }
    });

    jQuery('#wateringthreshold').slider({
      formatter: function(value) {
        return (value + ' in');
      }
    });
    
    $http.get('/api/settings/'+user.settingId).success(function(res) {
      if (res.length < 1) {
        return console.log('no settings found!');
      }

      console.log(res);
      updateSettings(res);
    });

    $scope.submit = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if(jQuery('#wateringtype').val() === 'Recommended') {
          jQuery('#wateringthreshold').slider('setValue', 2.0);
        } else if(jQuery('#wateringtype').val() === 'Economical') {
          jQuery('#wateringthreshold').slider('setValue', 1.5)
        }

        console.log(jQuery('#wateringthreshold').val());

        $http.put('/api/settings/'+user.settingId, {
            wateringtype : jQuery('#wateringtype').val(),
            numberofzones : jQuery('#numberofzones').val(),
            wateringthreshold : jQuery('#wateringthreshold').val(),
            soiltype : jQuery('#soiltype').val(),
            planttype : jQuery('#planttype').val(),
            shadedarea : jQuery('#shadedarea').prop('checked'),
            slopedarea : jQuery('#slopedarea').prop('checked') 
          })
          .success(function(res) {
            console.log('res: '+res);
            $scope.message = 'Settings saved successfully.';
          });
      }
    };

    function updateSettings(settings) {
        jQuery('#wateringtype').val(settings.wateringtype);
        jQuery('#numberofzones').slider('setValue', Number(settings.numberofzones));
        jQuery('#wateringthreshold').slider('setValue', Number(settings.wateringthreshold));
        jQuery('#soiltype').val(settings.soiltype);
        jQuery('#planttype').val(settings.planttype);
        jQuery('#shadedarea').prop('checked', settings.shadedarea);
        jQuery('#slopedarea').prop('checked', settings.slopedarea);

        if(settings.wateringtype === 'Custom') { 
          $scope.customThreshold = true;
        } else {
          $scope.customThreshold = false;
        } 
    }
  });

