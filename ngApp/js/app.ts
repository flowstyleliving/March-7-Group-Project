'use strict';
namespace app {
  angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngMessages', 'ngMaterial'])
    .config((
    $mdThemingProvider,
    $httpProvider: ng.IHttpProvider,
    $stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state('Home', {
      url: '/',
      templateUrl: '/templates/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    }).state('Login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'UserLoginController',
      controllerAs: 'vm'
    }).state('Register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: 'UserRegisterController',
      controllerAs: 'vm'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('grey')
        .accentPalette('teal');

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
  });
}
