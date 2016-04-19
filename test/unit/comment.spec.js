"use strict";
let should = require('should');
let Comment = require('../../Comment/model').Comment;

describe('Comment Model', () => {
  it('Should make message, user, and item required', (done) => {
    let props = Comment.schema.tree;
    props.message.required.should.equal(true);
    props.item.required.should.equal(true);
    props.user.required.should.equal(true);
    props.item.ref.should.equal('Item');
    props.user.ref.should.equal('User');
    done();
  });
})
