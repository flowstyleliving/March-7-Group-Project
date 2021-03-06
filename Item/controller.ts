import * as mongoose from 'mongoose';
import * as express from 'express';
import {Item, IItemModel} from './model';
import {User, IUserModel} from '../User/model';
import {Comment, ICommentModel} from '../Comment/model';

export function getAll(req: express.Request, res: express.Response, next: Function) {
    Item.find({_id: req.params.id})
    .populate('user', 'name')
    .exec((err, items)=>{
        if (err) return next (err);
        res.json(items);
    });
}

export function getOne(req: express.Request, res: express.Response, next: Function) {
    Item.findOne({_id: req.params.id})
    .populate('user', 'name')
    .populate('comments', '-item')
    .exec((err, data)=>{
        if (err) return next(err);
        Comment.populate(data.comments, {path: 'user', select:'name img', model: 'User'}, (err, response) => {
            if (err) return next(err);
            res.json(data);
        });
    });
}

export function create(req: express.Request, res: express.Response, next: Function) {
    req.body.user = req['payload']._id;
    req.body.datePosted = Date.now();
    req.body.dateUpdated = Date.now();
    Item.create(req.body, (err, item:IItemModel)=>{
        if (err) return next (err);
        User.update({ _id: item.user }, { $push: { 'items': item._id } }, (err, result) => {
          if (err) return next(err);
          res.json(item);
        });
    });
}

export function update(req: express.Request, res: express.Response, next: Function) {
    req.body.dateUpdated = Date.now();
    Item.update({_id: req.params.id, user: req['payload']._id}, req.body,(err, numRows: any) => {
        if (err) return next(err);
        res.json({message: 'This item has been updated!'});
    })
}

export function remove(req: express.Request, res: express.Response, next: Function) {
    Item.findOneAndRemove({_id: req.params.id, user: req['payload']._id}, (err, item) => {
        if (err) return next(err);
        if (item) {
            Comment.remove({item: req.params.id}, (err) => {
                if (err) return next (err);
                User.update({_id: req['payload']._id}, {$pull: {items: item._id}}, (err, numRows: any) =>{
                    if (err) return next (err);
                    if (numRows.nModified === 0) return next({ message: "Could not update the requested item.", status: 500 });
                    res.json({message: 'This item has been removed'});
                })
            });
        }else {
            next({message: 'Unable to delete item', status: 500});
        }
    });
}
