namespace app.Services{
  export class UserService{
    public status = {_id: null, name: null};

    public login(user){

    }

    public logout(){}

    public register(){}

    public forgotPassword(){}

    public resetPassword(){}

    public getToken(){
      return this.$window.localStorage.getItem('token');
    }

    public setToken(token: string){
      return this.$window.localStorage.setItem('token',token);
    }

    public setUser(){}

    public clearUser(){}

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $window: ng.IWindowService){
      if(this.getToken()) this.setUser();
    }
  }
  angular.module('app').service('UserService', UserService);
}
