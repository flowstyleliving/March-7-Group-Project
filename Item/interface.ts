namespace app.i{
  export interface IItem{
    _id: any;
    title: string;
    images: [{
      imgUrl: string;
      caption: string;
      mainOrNah: boolean;
    }];
    description: string;
    datePosted: number;
    dateComplete: string;
    notes: string;
    category: string;

    user: (string | IUser);
    comments: [string | IComment];
  }
}
