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

        public edit(item){
            this.$state.go('ItemUpdate',{id: item._id});
        }

        constructor(private UserService: app.Services.UserService, private $state: ng.ui.IStateService) {
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((res) => {
                this.user = res;
                for (let i = 0; i < this.user.items.length; i++){
                    if(this.category.indexOf(this.user.items[i].category) > -1){
                        continue;
                    }
                    this.category.push(this.user.items[i].category);
                }
            });
        }
    }
    angular.module('app').controller('PortfolioManagerController', PortfolioManagerController);
}
