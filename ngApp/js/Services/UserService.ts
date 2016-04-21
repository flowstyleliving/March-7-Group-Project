namespace app.Services{
    export class UserService {
        public status = { _id: null, name: null };

        public getUser(id: string){
            let q = this.$q.defer();
            this.$http.get('/api/v1/users/' + id, null).then((res)=>{
                q.resolve(res.data);
            });
            return q.promise;
        }

        public getAll(){
            let q = this.$q.defer();
            this.$http.get('/api/v1/users/', null).then((res)=>{
                q.resolve(res.data);
            });
            return q.promise;
        }

        public update(id: string, user){
            let q = this.$q.defer();
            this.$http.put('/ap/v1/users/update/' + id, user).then((res)=>{
                q.resolve();
            });
            return q.promise;
        }

        public login(user) {
            let q = this.$q.defer();
            this.$http.post('/api/v1/users/login', user).then((res) => {
                this.setToken(res.data['token']);
                this.setUser();
                q.resolve();
            });
            return q.promise;
        }

        public logout() {
            this.$window.localStorage.removeItem('token');
            this.clearUser();
        }

        public register(user: app.i.IUser) {
            let q = this.$q.defer();
            this.$http.post('/api/v1/users/register', user).then((res) => {
                this.setToken(res.data['token']);
                this.setUser();
                q.resolve();
            });
            return q.promise;
        }

        public forgotPassword(user) {
          let q = this.$q.defer();
          this.$http.post('/api/v1/users/forgot', user).then((res) => {
              q.resolve();
          });
          return q.promise;
        }

        public getToken() {
            return this.$window.localStorage.getItem('token');
        }

        public setToken(token: string) {
            return this.$window.localStorage.setItem('token', token);
        }

        public setUser() {
            let token = this.getToken();
            console.log(token);
            let u = JSON.parse(this.urlBase64Decode(this.getToken().split('.')[1]));
            this.status._id = u._id;
            this.status.name = u.name;
        }

        public clearUser() {
            this.status._id = null;
            this.status.name = null;
        }
        public urlBase64Decode(str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0: { break; }
                case 2: { output += '=='; break; }
                case 3: { output += '='; break; }
                default: {
                    throw 'Illegal base64url string!';
                }
            }
            return decodeURIComponent(encodeURIComponent(this.$window.atob(output))); //polifyll https://github.com/davidchambers/Base64.js
        }


        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $window: ng.IWindowService) {
            if (this.getToken()) this.setUser();
        }
    }
    angular.module('app').service('UserService', UserService);
}
