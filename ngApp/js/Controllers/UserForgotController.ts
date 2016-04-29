namespace app.Controllers {
    export class UserForgotController {
        public user = {};

        public toastFail() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Email is not registered with Folio')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public toast() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Reset Password Email has been sent')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public forgot(){
            this.UserService.forgotPassword(this.user).then(()=> {
                this.$state.go('Login');
                this.toast();
            }, () => {
              return this.toastFail();
            })
        }
        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $mdToast: ng.material.IToastService) {

        }
    }
    angular.module('app').controller('UserForgotController', UserForgotController)
}
