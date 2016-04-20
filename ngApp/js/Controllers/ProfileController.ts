namespace app.Controllers {
    export class ProfileController {
        public status;

        public social = [];
        public socialHold;

        /////////Add socialSite to Array
        public addSocial(){
            this.social.push(this.socialHold);
            this.socialHold = {};
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
        constructor(private UserService: app.Services.UserService, private $mdDialog){
            this.status = UserService.status;
            this.openDialog();
        }
    }
    angular.module('app').controller("ProfileController", ProfileController);
}
