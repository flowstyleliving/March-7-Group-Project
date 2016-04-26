namespace app.Controllers {
    export class ItemController{
        public item;
        public status;
        public comment: app.i.IComment;

        public createComment() {
          this.comment.item = this.comment._id;
          this.CommentService.create(this.comment).then((res) => {
            this.item.comments.push(res);
            this.comment.message = '';
            this.comment.user = '';
          });
        }

        public removeComment(c: app.i.IComment) {
          this.CommentService.remove(c._id).then(() => {
            this.item.comments.splice(this.item.comments.indexOf(c),1);
          });
        }

        constructor(
            private UserService: app.Services.UserService,
            private CommentService: app.Services.CommentService,
            private $stateParams: ng.ui.IStateParamsService,
            private ItemService: app.Services.ItemService,
            private $state: ng.ui.IStateService
        ){
            this.status = UserService.status;
            this.item = ItemService.getOne($stateParams['id']);
        }
    }
    angular.module('app').controller("ItemController", ItemController);
}
