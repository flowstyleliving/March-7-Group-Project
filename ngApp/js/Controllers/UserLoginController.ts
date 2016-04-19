namespace app.Controllers {
    export class UserLoginController {
        public user = {};

        public login(){
            this.UserService.login(this.user).then(()=> {
                this.$state.go('Home');
            })
        }
        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {

        }
    }
    angular.module('app').controller('UserLoginController', UserLoginController)
}
