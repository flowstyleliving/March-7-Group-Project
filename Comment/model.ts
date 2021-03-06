import * as mongoose from 'mongoose';

export interface ICommentModel extends app.i.IComment, mongoose.Document {}

let commentSchema = new mongoose.Schema({
  message: {type: String, required: true},
  datePosted: {type: Number},

  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

export let Comment = mongoose.model<ICommentModel>('Comment', commentSchema);
