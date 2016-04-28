namespace app.Controllers {
    export class PortfolioManagerController {
        public status;
        public user;
        public category =[];
        public selectedCategory;

        public getItems(){
            this.UserService.getUser(this.status.email).then((res) => {
                this.user = res;
                if(this.selectedCategory != "-"){
                    this.user.items = this.user.items.filter((u)=> {
                        return u.category == this.selectedCategory
                    });
                }
            })
        }

        constructor(private UserService: app.Services.UserService) {
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((res) => {
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
    angular.module('app').controller('PortfolioManagerController', PortfolioManagerController);
}
