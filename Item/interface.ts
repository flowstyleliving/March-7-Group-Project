namespace app.i{
  export interface IItem{
    _id: any;
    title: string;
    images: [any];
    description: string;
    datePosted: number;
    dateCompleted: string;
    notes: string;
    category: string;

    user: (string | IUser);
    comments: [string | IComment];
  }
}
