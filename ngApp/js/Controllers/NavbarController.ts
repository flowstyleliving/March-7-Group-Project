namespace app.Controllers {
    export class NavbarController {
        public status;
        public user;

        public logout() {
          this.UserService.logout();
          this.$state.go('Login');
        }

        public openLeftMenu = function() {
            this.$mdSidenav('left').toggle();
        };

        public visit (f){
            this.$state.go("User Profile", {email: f.user.email });
        }


        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService, private $mdSidenav){
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((res)=>{
                this.user = res;
            })
        }
    }
    angular.module('app').controller("NavbarController", NavbarController);
}
