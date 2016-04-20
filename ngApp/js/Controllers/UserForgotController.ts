namespace app.Controller{
  export class UserForgotController{
    public user = {};

    public forgotUser(){
        this.UserService.forgotPassword(this.user).then(()=> {
            this.$state.go('Receive');
        })
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService){}
  }
  angular.module('app').controller('UserForgotController', UserForgotController);
}
