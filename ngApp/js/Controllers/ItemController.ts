namespace app.Controllers {
    export class ItemController {
        public item: app.i.IItem;
        public status;
        public isShow = true;
        public comment;

        public direction = 'left';
        public currentIndex = 0;

        public setCurrentSlide(index: number) {
          this.direction = (index > this.currentIndex) ? 'left' : 'right';
          this.currentIndex = index;
        }

        public isCurrentSlide(index: number) {
          return this.currentIndex === index;
        }

        public prevSlide() {
          this.direction = 'left';
          this.currentIndex = (this.currentIndex < this.item.images.length - 1) ? ++this.currentIndex: 0;
        }

        public nextSlide() {
          this.direction = 'right';
          this.currentIndex = (this.currentIndex > 0) ? --this.currentIndex : this.item.images.length - 1;
        }

        public toast() {
          this.$mdToast.show(
            this.$mdToast.simple('Your comment has been removed')
            .position('top right')
            .hideDelay(3000)
          );
        }

        public createComment() {
            this.comment.item = this.item._id;
            this.CommentService.create(this.comment).then((res) => {
                this.item.comments.push(res);
                this.comment.message = "";
                this.comment.user = "";
                this.$state.reload();
            });
        }

        public removeComment(c: app.i.IComment) {
            this.CommentService.remove(c._id).then(() => {
                this.item.comments.splice(this.item.comments.indexOf(c), 1);
                this.toast();
            });
        }


        ///$mdDialog
        public showAdvanced(i) {
            this.$mdDialog.show({
                locals: { i: i },
                controller: "DialogController as vm",
                templateUrl: '/templates/image.html',
                clickOutsideToClose: true,
            })
        };

        constructor(
            private UserService: app.Services.UserService,
            private CommentService: app.Services.CommentService,
            private $stateParams: ng.ui.IStateParamsService,
            private ItemService: app.Services.ItemService,
            private $state: ng.ui.IStateService,
            private $mdDialog,
            private $mdMedia,
            private $mdToast
            ) {
            this.status = UserService.status;
            ItemService.getOne($stateParams['id']).then((res) => {
              this.item = res;
            });
        }
    }
    angular.module('app').controller("ItemController", ItemController);

    export class DiaglogController {
        public image = this.i;

        constructor(private $mdDialog, private i) { }
    }
    angular.module('app').controller("DialogController", DiaglogController);


}
