namespace app.Controllers {
    export class ProfileController {
        public status;
        public user;
        public socialHold;
        public social = [];

        /////////Add socialSite to Array
        public addSocial(){
            this.social.push(this.socialHold);
            this.socialHold = {};
        }

        public updateProfile(){
            this.UserService.update(this.status._id, this.user.aboutMe, this.social).then((res)=>{
                this.$state.go('Home');
            })
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
        constructor(private UserService: app.Services.UserService, private $mdDialog, private $state: ng.ui.IStateService){
            this.status = UserService.status;
            UserService.getUser(this.status._id).then((data)=>{
                this.user = data;
                if(!this.user.aboutMe){
                    this.openDialog();
                }
            })
        }
    }
    angular.module('app').controller("ProfileController", ProfileController);
}
