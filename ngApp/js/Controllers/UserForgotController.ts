namespace app.Controller{
  export class UserForgotController{

    constructor(private UserService: app.Services.UserService){}
  }
  angular.module('app').controller('UserForgotController', UserForgotController);
}
