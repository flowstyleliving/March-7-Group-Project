namespace app.Controllers{
    export class UserProfileController {
        public status;
        public user;
        public url = 'fa-facebook-square';

        public category =[];
        public selectedCategory;

        public getItems(){
            this.UserService.getUser(this.user.email).then((res) => {
                this.user = res;
                if(this.selectedCategory != "-"){
                    this.user.items = this.user.items.filter((u)=> {
                        return u.category == this.selectedCategory
                    });
                }
            })
        }


        public like(user) {
            this.UserService.like(this.status._id, user);
        }

        constructor(private UserService: app.Services.UserService, private $stateParams: ng.ui.IStateParamsService, private $mdToast){
          this.status = UserService.status;
          UserService.getUser($stateParams['email']).then((res) => {
              this.user = res;
              for (let i = 0; i < this.user.items.length; i++){
                  this.category.push(this.user.items[i].category);
                  if(this.category.indexOf(this.user.items[i].category) > -1){
                      continue;
                  }
              }
          });
        }
    }
    angular.module('app').controller("UserProfileController", UserProfileController);
}
