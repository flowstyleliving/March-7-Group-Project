namespace app.Controllers {
    export class HomeController {
        public status;
        public user;
        public users;
        public themes = ["dark-teal","dark-red","dark-purple","dark-indigo","dark-light-green","dark-pink"];

        public theme(){
            let n = Math.floor(Math.random() * this.themes.length);
            console.log(n);
            return this.themes[n];
        }



        public
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
            UserService.getAll().then((res)=>{
                this.users = res;
                for(let i = 0; i < this.users.length; i++){
                    this.users[i].theme = this.theme();
                }
            })
        }
    }
    angular.module('app').controller('HomeController', HomeController);
}
