namespace app.Controllers {
  export class GlobalController {
    public status;

    constructor(private UserService: app.Services.UserService) {
      this.status = UserService.status;
    }
  }

  angular.module('app').controller('GlobalController', GlobalController);
}
