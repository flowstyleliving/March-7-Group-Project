angular.module('app').directive('navbar', () => ({
  templateUrl: '../views/templates/nav.html',
  restrict: 'E',
  controller: 'NavbarController',
  controllerAs: 'nav'
}));
