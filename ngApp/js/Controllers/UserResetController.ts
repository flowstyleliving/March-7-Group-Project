namespace app.Controllers {
    export class UserResetController {
        public user = {};

        public toastFail() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Invalid or expired access token')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public toast() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Password has been updated')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public resetPassword(){
          this.UserService.resetPassword(this.user, this.$stateParams['token']).then(() => {
            this.$state.go('Login');
            this.toast();
          }, () => {
            return this.toastFail();
          })
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private $mdToast: ng.material.IToastService) {

        }
    }
    angular.module('app').controller('UserResetController', UserResetController)
}
