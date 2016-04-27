namespace app.Controllers {
    export class ItemController {
        public item: app.i.IItem;
        public status;
        public isShow = true;
        public comment;

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
            private $mdMedia
            ) {
            this.status = UserService.status;
            this.item = ItemService.getOne($stateParams['id']);
        }
    }
    angular.module('app').controller("ItemController", ItemController);

    export class DiaglogController {
        public image = this.i;

        constructor(private $mdDialog, private i) { }
    }
    angular.module('app').controller("DialogController", DiaglogController);
}
