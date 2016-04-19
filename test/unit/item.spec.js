"use strict";
let should = require('should');
let Item = require('../../Item/model').Item;

describe('Item Model', () => {
  it('Should require user and ref User', (done) => {
    let props = Item.schema.tree;
    props.user.required.should.equal(true);
    props.user.ref.should.equal('User');
    done();
  });
  it('Should ref to comments correctly', (done) => {
    Item.schema.tree.comments[0].ref.should.equal('Comment');
    done();
  });
});
