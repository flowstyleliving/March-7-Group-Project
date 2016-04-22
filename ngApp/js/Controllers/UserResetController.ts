namespace app.Controller{
  export class UserResetController{
    public user;

    public reset(){
        this.UserService.resetPassword(this.user).then((res)=> {
            this.$state.go('Home');
        })
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {}
  }
  angular.module('app').controller('UserResetController', UserResetController);
}
