namespace app.Controllers{
    export class UserProfileController {
        public user;

        public url = 'fa-facebook-square';

        constructor(private UserService: app.Services.UserService, private $stateParams: ng.ui.IStateParamsService){
            UserService.getUser($stateParams['id']).then((res)=>{
                this.user = res;
            });
        };
    }
    angular.module('app').controller("UserProfileController", UserProfileController);
}
