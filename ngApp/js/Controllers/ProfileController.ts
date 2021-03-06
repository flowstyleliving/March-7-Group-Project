namespace app.Controllers {
    export class ProfileController {
        public status;
        public user;
        public socialHold= {
            provider: null,
            url: "http://"
        }
        public isShow = false;
        public theme;

        public personalHold = {
            url: 'http://'
        }

        /////////Add socialSite to Array
        public addSocial(){
            this.user.social.push(this.socialHold);
            this.socialHold = {
                provider: null,
                url: "http://"
            };
        }

        public updateProfile(){
            this.UserService.update(this.user.email, this.user.aboutMe, this.user.name, this.user.location, this.user.personalURL, this.user.social, this.user.img, this.theme).then((res)=>{
                this.$state.go('Portfolio Manager');
            })
        }

        public pickFile() {
          this.filepickerService.pick(
            { mimetype: 'image/*',
             cropRatio: 1,
             cropForce: true
            },
            this.fileUploaded.bind(this)
            );
        }

        public fileUploaded(file) {
          this.user.img = file.url;
          this.isShow = true;
          this.$scope.$apply(); // force page to update
        }

        //////////////$mdDialog(Modal);
        public openDialog () {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Wait...hold up!')
                    .textContent("It looks like you haven't set up a profile yet. Shall we?")
                    .ariaLabel('Profile Set Up')
                    .ok("Let's Do It!")
                );
        };
        constructor(private UserService: app.Services.UserService, private $mdDialog, private $state: ng.ui.IStateService, private filepickerService,
              private $scope: ng.IScope){
            this.status = UserService.status;
            UserService.getUser(this.status.email).then((data)=>{
                this.user = data;
                if(!this.user.aboutMe){
                    this.openDialog();
                }
            })
        }
    }
    angular.module('app').controller("ProfileController", ProfileController);
}
