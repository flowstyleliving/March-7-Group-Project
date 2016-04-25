namespace app.Controllers {
    export class UserResetController {
        public user = {};

        public resetPassword(){
          this.UserService.resetPassword(this.user).then(() => {
            this.$state.go('Login');
          })
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {

        }
    }
    angular.module('app').controller('UserResetController', UserResetController)
}
