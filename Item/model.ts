import * as mongoose from 'mongoose';

export interface IItemModel extends app.i.IItem, mongoose.Document{}

let itemSchema = new mongoose.Schema({
    title: {type: String},
    images: [],
    description: {type: String},
    datePosted: {type: Number},
    dateCompleted: {type: String},
    projectURL: {type: String},
    notes: {type: String},
    category: {type: String, lowercase: true, trim: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

export let Item = mongoose.model<IItemModel>('Item', itemSchema);
