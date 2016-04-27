namespace app.Controllers {
    export class UserResetController {
        public user = {};

        public resetPassword(){
          this.UserService.resetPassword(this.user, this.$stateParams['token']).then(() => {
            this.$state.go('Login');
          })
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService) {

        }
    }
    angular.module('app').controller('UserResetController', UserResetController)
}
