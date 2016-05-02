namespace app.Controllers {
  export class UserRegisterController {
    public user: app.i.IUser;

    public toastFail() {
      this.$mdToast.show(
        this.$mdToast.simple()
        .textContent('Email already exists')
        .position('top right')
        .hideDelay(3000)
      );
    }

    public register() {
      this.UserService.register(this.user).then(() => {
        this.$state.go('Home');
      }, () => {
        return this.toastFail();
      });
    }

    constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $mdToast: ng.material.IToastService) {

    }
  }

  angular.module('app').controller('UserRegisterController', UserRegisterController);
}
