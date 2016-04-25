namespace app.Controllers {
    export class ItemController{
        public item;
        public status;

        constructor(
            private UserService: app.Services.UserService,
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
