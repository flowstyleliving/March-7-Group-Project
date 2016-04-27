namespace app.i{
  export interface IUser{
    _id: any;
    email: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordDate: number;
    name: string;
    img?: string;
    aboutMe?: string;
    social: [{
        provider: string,
        url: string,
        template: string,
    }];
    theme: string;
    comments?: Array<string>;
    items?: Array<string>;
    facebook: {id: string, token: string},
    google: {id: string, token: string},
  }
}
