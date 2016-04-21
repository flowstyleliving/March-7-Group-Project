namespace app.Controllers {
    export class HomeController {
        public status;
        public user;

        constructor(private UserService: app.Services.UserService, private $location: ng.ILocationService, private $mdDialog, private $state: ng.ui.IStateService) {
            this.status = UserService.status;
            console.log($location.search());
            if ($location.search().code) {
                UserService.setToken($location.search().code);
                UserService.setUser();
                $location.search('');
                if ($location.hash()) $location.hash('');
            }
            UserService.getUser(this.status._id).then((data)=>{
                this.user = data;
                if(!this.user.aboutMe){
                    this.$state.go('Create Profile');
                }
            });
        }
    }
    angular.module('app').controller('HomeController', HomeController);
}
