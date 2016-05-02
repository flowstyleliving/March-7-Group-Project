'use strict';
namespace app {
  angular.module('app', [
    'ui.router',
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'ngMessages',
    'ngMaterial',
    'angular-filepicker',
    'uiGmapgoogle-maps',
    'ngEmbed'
  ])
    .config((
    $mdThemingProvider,
    $httpProvider: ng.IHttpProvider,
    $stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    filepickerProvider,
    uiGmapGoogleMapApiProvider: any,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    filepickerProvider.setKey('ArDxY3ePCQ6eI13v5WoxOz');

    $stateProvider.state('Home', {
      url: '/',
      templateUrl: '/templates/intro.html',
      controller: 'UserRegisterController',
      controllerAs: 'vm'
    }).state('Home2', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    }).state('InvalidPage', {
      url: '/InvalidPage',
      templateUrl: '/templates/404.html'
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
    }).state('UpdatePassword', {
      url: '/resetPassword/:token',
      templateUrl: '/templates/resetPassword.html',
      controller: 'UserResetController',
      controllerAs: 'vm'
    }).state('itemCreate', {
      url: '/createitem',
      templateUrl: '/templates/itemCreate.html',
      controller: 'ItemCreateController',
      controllerAs: 'vm'
    }).state('Settings', {
        url:'/settings',
        templateUrl: '/templates/createprofile.html',
        controller: "ProfileController",
        controllerAs: 'vm'
    }).state('User Profile', {
        url:'/userprofile/:email',
        templateUrl: '/templates/profile.html',
        controller: 'UserProfileController',
        controllerAs: 'vm'
    }).state('Item', {
        url: '/item/:id',
        templateUrl: '/templates/itemDetails.html',
        controller: 'ItemController',
        controllerAs: 'vm'
    }).state('ItemUpdate', {
        url: '/itemupdate/:id',
        templateUrl: '/templates/itemUpdate.html',
        controller: 'ItemUpdateController',
        controllerAs: 'vm'
    }).state('ImageUpdate', {
        url: '/itemupdate-images/:id',
        templateUrl: '/templates/ImageUpdate.html',
        controller: 'ItemUpdateController',
        controllerAs: 'vm'
    }).state('AboutFolio', {
        url: '/aboutUs',
        templateUrl: '/templates/aboutFolio.html',
        controller: 'AboutUsController',
        controllerAs: 'vm'
    }).state('Portfolio Manager', {
        url: '/portfoliomanager/:email',
        templateUrl: '/templates/portfoliomanager.html',
        controller: 'PortfolioManagerController',
        controllerAs: 'vm'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('grey')
        .accentPalette('teal');

    $mdThemingProvider.theme('dark-teal').primaryPalette('teal').backgroundPalette('lime').dark();
    $mdThemingProvider.theme('dark-red').primaryPalette('red').backgroundPalette('red').dark();
    $mdThemingProvider.theme('dark-purple').primaryPalette('deep-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-indigo').primaryPalette('indigo').backgroundPalette('indigo').dark();
    $mdThemingProvider.theme('dark-light-green').primaryPalette('light-green').backgroundPalette('light-green').dark();
    $mdThemingProvider.theme('dark-pink').primaryPalette('pink').backgroundPalette('pink').dark();

    $urlRouterProvider.otherwise('InvalidPage');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
    uiGmapGoogleMapApiProvider.configure({});
  });
}
