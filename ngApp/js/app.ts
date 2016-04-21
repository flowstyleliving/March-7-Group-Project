'use strict';
namespace app {
  angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngMessages', 'ngMaterial', 'angular-filepicker'])
    .config((
    $mdThemingProvider,
    $httpProvider: ng.IHttpProvider,
    $stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    filepickerProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    filepickerProvider.setKey('ArDxY3ePCQ6eI13v5WoxOz');

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
    }).state('Forgot', {
      url: '/forgot',
      templateUrl: '/templates/forgot.html',
      controller: 'UserForgotController',
      controllerAs: 'vm'
    }).state('itemCreate', {
      url: '/itemcreate',
      templateUrl: 'templates/itemCreate.html',
      controller: 'ItemCreateController',
      controllerAs: 'vm'
    })
    .state('Create Profile', {
        url:'/createprofile',
        templateUrl: 'templates/createprofile.html',
        controller: "ProfileController",
        controllerAs: 'vm'
    }).state('Reset', {
      url: '/reset',
      templateUrl: '/templates/reset.html'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('grey')
        .accentPalette('teal');

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
  });
}
