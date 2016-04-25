namespace app.Controllers {
    export class UserResetController {
        public user = {};

        public checkToken(){
            this.UserService.checkToken(this.user).then(()=> {
                this.$state.go('UpdatePassword');
            })
        }

        public resetPassword(){
          this.UserService.resetPassword(this.user).then(() => {
            this.$state.go('Home');
          })
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {

        }
    }
    angular.module('app').controller('UserResetController', UserResetController)
}
