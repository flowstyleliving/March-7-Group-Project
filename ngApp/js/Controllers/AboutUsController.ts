namespace app.Controllers{
  export class AboutUsController{
    public center = { latitude: 37.09024, longitude: -100.712891};
        public zoom = 4;
        public markers = [
            {
                id: 0,
                options: {
                    title: 'Seattle Coder Camps',
                },
                latitude: 47.671853,
                longitude: -122.121328
            }
        ];
  }
  angular.module('app').controller('AboutUsController', AboutUsController);
}
