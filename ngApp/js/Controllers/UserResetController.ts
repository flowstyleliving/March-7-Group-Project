namespace app.Controller{
  export class UserResetController{

    public reset(token, user){
        this.UserService.resetPassword(token, user).then(()=> {
            this.$state.go('Home');
        })
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {}
  }
  angular.module('app').controller('UserResetController', UserResetController);
}
