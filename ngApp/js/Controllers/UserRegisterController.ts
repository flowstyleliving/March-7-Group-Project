namespace app.Controllers {
  export class UserRegisterController {
    public user: app.i.IUser;

    public register() {
      this.UserService.register(this.user).then(() => {
        this.$state.go('Home');
      });
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {

    }
  }

  angular.module('app').controller('UserRegisterController', UserRegisterController);
}
