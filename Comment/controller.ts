import * as mongoose from 'mongoose';
import * as express from 'express';
import {Comment, ICommentModel} from './model';
import {Item, IItemModel} from '../Item/model';

export function create(req: express.Request, res: express.Response, next: Function) {
  req.body.datePosted = Date.now();
  req.body.user = req['payload']._id;
  Comment.create(req.body, (err, comment) => {
    if(err) return next(err);
    Item.update({_id: comment.item}, {$push: {'comments': comment._id}}, (err, result) => {
      if(err) return next(err);
      res.json(comment);
    });
  });
}

export function remove(req: express.Request, res: express.Response, next: Function) {
  Comment.remove({_id: req.params.id}, (err) => {
    //if comment was found and deleted, update the Item
    if(Comment) {
      Item.update({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, numRows) => {
        if(err) return next(err);
        res.json({message: 'Your comment has been deleted!'});
      });
    } else {
      next({message: 'Could not delete the requested comment.', status: 500});
    }
  });
}
