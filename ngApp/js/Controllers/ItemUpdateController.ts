namespace app.Controllers{
  export class ItemUpdateController{
    public status;
    public item: app.i.IItem;

    public update() {
      this.ItemService.update(this.item).then((res) => {
        this.$state.go('Item', {id: this.item._id});
      });
    }

    constructor(private UserService: app.Services.UserService,
    private CommentService: app.Services.CommentService,
    private $stateParams: ng.ui.IStateParamsService,
    private ItemService: app.Services.ItemService,
    private $state: ng.ui.IStateService) {
      this.status = UserService.status;

    }
  }
  angular.module('app').controller('ItemUpdateController', ItemUpdateController);
}