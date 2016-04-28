namespace app.Controllers{
    export class UserProfileController {
        public user;
        public url = 'fa-facebook-square';
        public selectedItem;
        public items;

        public getItems() {
          console.log('works');
        }

        constructor(private UserService: app.Services.UserService, private $stateParams: ng.ui.IStateParamsService, private ItemService: app.Services.ItemService){
            UserService.getUser($stateParams['email']).then((res)=>{
                this.user = res;
            });

        };
    }
    angular.module('app').controller("UserProfileController", UserProfileController);
}
