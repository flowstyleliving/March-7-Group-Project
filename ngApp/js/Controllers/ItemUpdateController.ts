namespace app.Controllers{
  export class ItemUpdateController {
      public status;
      public item: app.i.IItem;
      public files = [];

      public updateToast() {
        this.$mdToast.show(
            this.$mdToast.simple('Your portfolio has been updated')
                .position('top right')
                .hideDelay(3000)
            );
      }


      public removeToast() {
        this.$mdToast.show(
            this.$mdToast.simple('Your portfolio has been updated, item removed')
                .position('top right')
                .hideDelay(3000)
            );
      }

      public removeToastFail() {
        this.$mdToast.show(
            this.$mdToast.simple('Could not remove this item, please try again')
                .position('top right')
                .hideDelay(3000)
            );
      }


      public update() {
        this.ItemService.update(this.item).then((res) => {
            this.$state.go('Item', { id: this.item._id });
            this.updateToast();
        });
      }

      public remove() {
        this.ItemService.delete(this.item._id).then(() => {
            this.$state.go('Portfolio Manager', { email: this.status.email });
            this.removeToast();
        }, () => {
          this.removeToastFail();

        });
      }

      public pickFile() {
        this.filepickerService.pickMultiple(
            { mimetype: 'image/*' },

            this.fileUploaded.bind(this)
            );
      }

      public fileUploaded(arr) { // pickMultiple() returns an arr of obj
        for(let i = 0; i < arr.length; i++) {
          this.files.push(arr[i]);
        }
        for(let i = 0; i < this.files.length; i++){
          this.item.images.push(this.files[i]);
        }
        this.$scope.$apply(); // force page to update
      }

      constructor(private UserService: app.Services.UserService,
          private CommentService: app.Services.CommentService,
          private $stateParams: ng.ui.IStateParamsService,
          private ItemService: app.Services.ItemService,
          private $state: ng.ui.IStateService,
          private filepickerService,
          private $mdToast,
          private $scope: ng.IScope) {
          this.status = UserService.status;
          ItemService.getOne($stateParams['id']).then((res) => {
              this.item = res;
          });
      }
  }
  angular.module('app').controller('ItemUpdateController', ItemUpdateController);
}
