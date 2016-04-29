namespace app.Controllers {
    export class UserLoginController {
        public user = {};

        public toastFail() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Invalid login')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public login(){
            this.UserService.login(this.user).then(()=> {
                this.$state.go('Home');
            }, () => {
              return this.toastFail();
            })
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $mdToast: ng.material.IToastService) {

        }
    }
    angular.module('app').controller('UserLoginController', UserLoginController)
}
