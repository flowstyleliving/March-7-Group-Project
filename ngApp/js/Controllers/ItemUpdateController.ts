namespace app.Controllers{
  export class ItemUpdateController{
    public status;
    public item: app.i.IItem;

    public update() {
      this.ItemService.update(this.item).then((res) => {
        this.$state.go('Item', {id: this.item._id});
      });
    }

    public remove(){
     this.ItemService.delete(this.item._id).then(() => {
       this.$state.go('User Profile',{email: this.status.email});
     });
   }

    constructor(private UserService: app.Services.UserService,
    private CommentService: app.Services.CommentService,
    private $stateParams: ng.ui.IStateParamsService,
    private ItemService: app.Services.ItemService,
    private $state: ng.ui.IStateService) {
      this.status = UserService.status;
      ItemService.getOne($stateParams['id']).then((res) => {
        this.item = res;
      });
    }
  }
  angular.module('app').controller('ItemUpdateController', ItemUpdateController);
}
