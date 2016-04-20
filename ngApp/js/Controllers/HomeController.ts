namespace app.Controllers {
    export class HomeController {
        public status;
        public user;

        public updateProfile(u){

        }

        constructor(private UserService: app.Services.UserService, private $location: ng.ILocationService, private $mdDialog, private $state: ng.ui.IStateService) {
            this.status = UserService.status;
            console.log($location.search());
            if ($location.search().code) {
                UserService.setToken($location.search().code);
                UserService.setUser();
                $location.search('');
                if ($location.hash()) $location.hash('');
            }
            UserService.getUser(this.status.id).then((data)=>{
                this.user = data;
                if(!this.user.bio){
                    this.$state.go('Profile');
                }
            });
        }
    }
    angular.module('app').controller('HomeController', HomeController);
}
