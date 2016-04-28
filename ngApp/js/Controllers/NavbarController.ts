namespace app.Controllers {
    export class NavbarController {
        public status;
        public user;

        public logout() {
          this.UserService.logout();
          this.$state.go('Login');
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService){
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((res)=>{
                this.user = res;
            })
            console.log(this.user)
        }
    }
    angular.module('app').controller("NavbarController", NavbarController);
}
