namespace app.Controllers {
    export class HomeController {
        public status;
        public user;
        public users;

        public toastFail() {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Email already exists')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public register() {
          this.UserService.register(this.user).then(() => {
            this.$state.go('Home');
          }, () => {
            return this.toastFail();
          });
        }

        constructor(private UserService: app.Services.UserService, private $location: ng.ILocationService, private $mdDialog, private $state: ng.ui.IStateService, private $mdToast) {
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
