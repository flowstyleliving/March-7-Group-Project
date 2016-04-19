namespace app.Controllers {
    export class HomeController {
      public user;

      constructor(private UserService: app.Services.UserService, private $location: ng.ILocationService){
        this.user = UserService.status;
        if($location.search().code){
          UserService.setToken($location.search().code);
          UserService.setUser();
          $location.search('');
          if($location.hash()) $location.hash('');
        }
      }
    }
    angular.module('app').controller('HomeController', HomeController);
}
