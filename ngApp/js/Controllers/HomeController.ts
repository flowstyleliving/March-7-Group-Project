namespace app.Controllers {
    export class HomeController {
        public status;
        public user;
        public users;

        constructor(private UserService: app.Services.UserService, private $location: ng.ILocationService, private $mdDialog, private $state: ng.ui.IStateService) {
            this.status = UserService.status;
            console.log($location.search());
            if ($location.search().code) {
                UserService.setToken($location.search().code);
                UserService.setUser();
                $location.search('');
                if ($location.hash()) $location.hash('');
            }
            if(this.status.email){
                UserService.getUser(this.status.email).then((data)=>{
                    this.user = data;
                    if(!this.user.aboutMe){
                        this.$state.go('Settings');
                    }
                });
            }
            UserService.getAll().then((res)=>{
                this.users = res;
            })
        }
    }
    angular.module('app').controller('HomeController', HomeController);
}
