namespace app.i {
  export interface IComment {
    _id: any;
    message: string;
    datePosted: number;

    item: (string | IItem);
    user: (string | IUser);
  }
}
