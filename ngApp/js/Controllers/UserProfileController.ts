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

        constructor(private UserService: app.Services.UserService, private $stateParams: ng.ui.IStateParamsService, private $mdToast, private $state: ng.ui.IStateService){
          this.status = UserService.status;
          UserService.getUser($stateParams['email']).then((res) => {
              this.user = res;
              for (let i = 0; i < this.user.items.length; i++){
                  if(this.category.indexOf(this.user.items[i].category) > -1){
                      continue;
                  }
                  this.category.push(this.user.items[i].category);

              }
          }, () => {
            this.$state.go('InvalidPage');
          });
        }
    }
    angular.module('app').controller("UserProfileController", UserProfileController);
}
