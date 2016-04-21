namespace app.Controller{
  export class UserResetController{

    public forgot(token){
        this.UserService.resetPassword(token).then(()=> {
            this.$state.go('Home');
        })
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {}
  }
  angular.module('app').controller('UserResetController', UserResetController);
}
