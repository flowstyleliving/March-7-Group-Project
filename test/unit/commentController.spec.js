"use strict"
let should = require('should');
let controller = require('../../Comment/controller');
let Comment = require('../../Comment/model').Comment;
let Item = require('../../Item/model').Item;
let sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');

describe('Comment Controller', () => {
  // MockUps
  let CommentMock, ItemMock;
  beforeEach((done) => {
    CommentMock = sinon.mock(Comment);
    ItemMock = sinon.mock(Item);
    done();
  });
  afterEach((done) => {
    CommentMock.restore();
    ItemMock.restore();
    done();
  });

  // start tests
  describe('create()', () => {
    let createStub;
    beforeEach((done) => {
      createStub = sinon.stub(Comment, 'create');
      done();
    });
    afterEach((done) => {
      createStub.restore();
      done();
    });

    it('Should add date to comment and return new comment', (done) => {
      createStub.yields(null, {_id: 1, item: 4});
      ItemMock.expects('update').withArgs({_id: 4}, {$push: {'comments': 1}})
      .yields(null);

      let req = {
        body: {message: 'Hello!'},
        payload: {_id: 4}
      };
      let res = {
        json: function(data) {
          ItemMock.verify();
          let c = createStub.getCalls()[0].args[0];
          c.message.should.equal('Hello!');
          c.user.should.equal(4);
          should.exist(c.datePosted);

          data._id.should.equal(1);
          data.item.should.equal(4);
          done();
        }
      };
      let next = function(err) {
        throw new Error(err);
      };
      controller.create(req, res, next);
    });
    it('Should call next with error', (done) => {
      createStub.yields("Error ma nigga!");

      let req = {
        body: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON was supposed to be sleeping!')}};
      let next = function(err) {
        err.should.equal("Error ma nigga!");
        done();
      };
      controller.create(req, res, next);
    });
    it('Should throw an error on Item update', (done) => {
      createStub.yields(null, {_id: 2, item: 3});

      ItemMock.expects('update')
      .yields('Error bruh.')

      let req = {
        body: {},
        payload: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted sleep!')
        }
      };
      let next = function(err) {
        err.should.equal('Error bruh.');
        done();
      };
      controller.create(req, res, next);
    });
  });

  describe('remove()', () => {
    it('should return success', (done) => {
      CommentMock.expects('remove').withArgs({_id: 3})
      .yields(null, {})

      let req = {
        params: {id: 3},
        payload: {id: 3}
      };
      let res = {
        json: function(data) {
          data.message.should.equal('Your comment has been deleted!');
          CommentMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next should not have been called bro.')
      };
      controller.remove(req, res, next);
    });
    it('Should throw next with an error', (done) => {
      CommentMock.expects('remove')
      .yields('Error!')

      let req = {
        params: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON WHY!?');
        }
      };
      let next = function(err) {
        err.should.equal('Error!');
        CommentMock.verify();
        done();
      };
      controller.remove(req, res, next);
    });
  });
});
