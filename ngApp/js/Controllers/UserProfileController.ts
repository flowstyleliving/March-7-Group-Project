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

        public showActionToast (user) {
            var seeya = user;
            var toast = this.$mdToast.simple()
                .textContent('Disliking hides this user forever! Proceed?')
                .action('OK')
                .highlightAction(false)
                .position('top right')
                .hideDelay(3000);
            this.$mdToast.show(toast).then((response)=>{
                if ( response == 'ok' ) {
                    this.dislike();
                    console.log("peace");
                }
            });
        };


        public like() {
            this.UserService.like(this.status.email);
        }

        public dislike() {
            this.UserService.dislike(this.status.email);
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
