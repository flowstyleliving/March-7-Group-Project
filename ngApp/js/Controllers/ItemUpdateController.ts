namespace app.Controllers{
  export class ItemUpdateController{
    public status;
    public item: app.i.IItem;
    public files = [];

    public update() {
      for(let i = 0; i < this.file.length; i++){
        this.item.images.push(this.files[i]);
      }
      this.ItemService.update(this.item).then((res) => {
        this.$state.go('Item', {id: this.item._id});
      });
    }

    public remove(){
     this.ItemService.delete(this.item._id).then(() => {
       this.$state.go('User Profile',{email: this.status.email});
     });
   }

   public pickFile() {
     this.filepickerService.pickMultiple(
       { mimetype: 'image/*'},

       this.fileUploaded.bind(this)
       );
   }

   public fileUploaded(arr) {
     for(let i = 0; i < arr.length; i++) {
       this.files.push(arr[i]);
     }
     this.$scope.$apply(); // force page to update
   }

    constructor(private UserService: app.Services.UserService,
    private CommentService: app.Services.CommentService,
    private $stateParams: ng.ui.IStateParamsService,
    private ItemService: app.Services.ItemService,
    private $state: ng.ui.IStateService,
    private filepickerService,
    private $scope: ng.IScope) {
      this.status = UserService.status;
      ItemService.getOne($stateParams['id']).then((res) => {
        this.item = res;
      });
    }
  }
  angular.module('app').controller('ItemUpdateController', ItemUpdateController);
}
