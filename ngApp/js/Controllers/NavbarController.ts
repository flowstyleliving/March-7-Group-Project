namespace app.Controllers {
    export class NavbarController {
        public status;

        public logout() {
          this.UserService.logout();
          this.$state.go('Login');
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService){
            this.status = UserService.status;
        }
    }
    angular.module('app').controller("NavbarController", NavbarController);
}
