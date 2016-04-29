namespace app.Controllers {
  export class ItemCreateController {
    public item: app.i.IItem;
    public file=[];
    public obj;
    public status;

    public create(){
        this.ItemService.createItem(this.item.title, this.file, this.item.description, this.item.dateCompleted, this.item.projectURL, this.item.category).then(()=>{
            this.$state.go('Portfolio Manager',{email: this.status.email});
        })
    }

    public pickFile() {
      this.filepickerService.pick(
        { mimetype: 'image/*'},

        this.fileUploaded.bind(this)
        );
    }

    public fileUploaded(file) {
      this.file.push(file);
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

// save file url to database
//   let modfile;
//   modfile.imgUrl = file.url;
//   this.file.push(modfile);
//   console.log(this.file);
// console.log(this.file)
// let modfile = {}
// modfile.imgUrl = this.file.url;
// modfile.caption = file.caption;
// modfile.mainOrNah = file.boolean;
// console.log(this.modfile)
// this.arr.push(modfile);
