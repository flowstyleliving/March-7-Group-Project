namespace app.Controllers {
    export class PortfolioManagerController {
        public status;
        public user;

        constructor(private UserService: app.Services.UserService) {
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((res) => {
                this.user = res;
            });
        }
    }
    angular.module('app').controller('PortfolioManagerController', PortfolioManagerController);
}
