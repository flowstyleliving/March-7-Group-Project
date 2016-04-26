namespace app.Controllers{
  export class AboutUsController{
    public center = {latitude: 37.808544, longitude: -122.253681};
        public zoom = 15;
        public markers = [
            {
                id: 0,
                options: {
                    title: 'Coder Camps',
                },
                latitude: 37.808544,
                longitude: -122.253681
            }
        ];
  }
  angular.module('app').controller('AboutUsController', AboutUsController);
}
