import * as mongoose from 'mongoose';

export interface ICommentModel extends app.i.IComment, mongoose.Document {}

let commentSchema = new mongoose.Schema({
  message: {type: String, required: true},
  datePosted: {type: Number},

  item: {type: mongoose.Schema.Types.ObjectID, ref: 'Item', required: true},
  user: {type: mongoose.Schema.Types.ObjectID, ref: 'User', requred: true}
});

export let Comment = mongoose.model<ICommentModel>('Comment', commentSchema);
