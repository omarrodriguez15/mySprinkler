'use strict';

describe('Controller: TestingCtrl', function () {

  // load the controller's module
  beforeEach(module('fullStackTestApp'));

  var TestingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestingCtrl = $controller('TestingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
