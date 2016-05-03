namespace app.Controllers {
  export class ItemCreateController {
    public item: app.i.IItem;
    public files = [];
    public status;

    public create(){
        this.ItemService.createItem(this.item.title, this.files, this.item.description, this.item.dateCompleted, this.item.projectURL, this.item.category).then(()=>{
            this.$state.go('Portfolio Manager',{email: this.status.email});
        })
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


    constructor(
      private ItemService: app.Services.ItemService,
      private $state: ng.ui.IStateService,
      private filepickerService,
      private $scope: ng.IScope,
      private UserService: app.Services.UserService
    ) {
      this.status = UserService.status;
    }
  }
  angular.module('app').controller('ItemCreateController', ItemCreateController);
}
