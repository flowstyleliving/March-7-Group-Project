angular.module('app').directive('navbar', () => ({
  templateUrl: '/templates/nav.html',
  restrict: 'E',
  controller: 'NavbarController',
  controllerAs: 'nav'
}));
