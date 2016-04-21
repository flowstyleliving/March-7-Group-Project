namespace app.Controllers {
    export class UserForgotController {
        public user = {};

        public forgot(){
            this.UserService.forgotPassword(this.user).then(()=> {
                this.$state.go('Reset');
            })
        }
        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {

        }
    }
    angular.module('app').controller('UserForgotController', UserForgotController)
}
