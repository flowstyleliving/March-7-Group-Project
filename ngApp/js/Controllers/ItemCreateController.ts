namespace app.Controllers {
  export class ItemCreateController {
    public arr = []
    public modfile: app.i.IItem;
    public file;

    public pickFile() {
      this.filepickerService.pick(
        { mimetype: 'image/*' },
        this.fileUploaded.bind(this)
        );
    }

    public fileUploaded(file) {
      // save file url to database
      this.file = file;
      console.log(file.url)
      this.modfile = {}
      this.modfile.images[0] = file.url;
      this.modfile['caption'] = file.caption;
      this.modfile['mainOrNah'] = file.boolean;
      console.log(this.modfile)
      this.arr.push(this.modfile);
      this.$scope.$apply(); // force page to update
    }

    constructor(private filepickerService, private $scope: ng.IScope) {

    }
  }
  angular.module('app').controller('ItemCreateController', ItemCreateController);
}
