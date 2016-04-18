namespace app.i{
  export interface IItem{
    _id: any;
    title: string;
    images: string;
    description: string;
    date: number;
    dateComplete: string,
    notes: string;
    category: string;
    user: (string | IUser);
    comments: [string | IComment];
  }
}
