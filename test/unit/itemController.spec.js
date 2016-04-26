"use strict";
let should = require('should');
let controller = require('../../Item/controller');
let User = require('../../User/model').User;
let Item = require('../../Item/model').Item;
let Comment = require('../../Comment/model').Comment;
let sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');

let UserMock, ItemMock, CommentMock;
beforeEach((done) => {
  UserMock = sinon.mock(User);
  ItemMock = sinon.mock(Item);
  CommentMock = sinon.mock(Comment);
  done();
});
afterEach((done) => {
  UserMock.restore();
  ItemMock.restore();
  CommentMock.restore();
  done();
});

describe('Item Controller', () => {
  describe('getAll()', () => {
    it('Should return array with length of 4', (done) => {
      ItemMock.expects('find').withArgs({_id: 5})
      .chain('populate', 'user', 'name')
      .chain('exec')
      .yields(null, [1,2,3,4])

      let req = {
        params: {
          id: 5
        }
      }
      let res = {
        json: function(data) {
          ItemMock.verify();
          data.should.be.an.instanceOf(Array);
          data.length.should.equal(4);
          done();
        }
      };
      let next = function() {
        throw new Error('Next was supposed to be sleeping!');
      };
      controller.getAll(req, res, next);
    });
    it('Should throw next with an error', (done) => {
      ItemMock.expects('find')
      .chain('populate', 'user', 'name')
      .chain('exec')
      .yields('ERROR')

      let req = {
        params: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON WANTED SWEEPYTIME!')
        }
      };
      let next = function(err) {
        err.should.equal('ERROR');
        done();
      };
      controller.getAll(req, res, next);
    });
  });

  describe('getOne()', () => {
    it('Should return an object by id', (done) => {
      ItemMock.expects('findOne').withArgs({_id: 5})
      .chain('populate', 'user', 'name')
      .chain('populate', 'comments', '-item')
      .chain('exec')
      .yields(null, {comments: 8})

      CommentMock.expects('populate')
      .withArgs(8, {
        path: 'user',
        select: 'name',
        model: 'User'
      })
      .yields(null, 3);

      let req = {
        params: {id: 5}
      };
      let res = {
        json: function(data) {
          data.comments.should.equal(8);
          //why is mock.verify() after data.shoulds?
          ItemMock.verify();
          CommentMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to sleep!')
      };
      controller.getOne(req, res, next);
    });
    it('Should throw next with an error', (done) => {
      ItemMock.expects('findOne')
      .chain('populate', 'user', 'name')
      .chain('populate', 'comments', '-item')
      .chain('exec')
      .yields("Error bro")

      let req = {
        params: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted to sleep!')
        }
      };
      let next = function(err) {
        err.should.equal('Error bro');
        ItemMock.verify();
        done();
      };
      controller.getOne(req, res, next);
    });
    it('Should throw an error on Comment.populate', (done) => {
      ItemMock.expects('findOne').withArgs({_id: 5})
      .chain('populate', 'user', 'name')
      .chain('populate', 'comments', '-item')
      .chain('exec')
      .yields(null, {comments: 8});

      CommentMock.expects('populate').withArgs(8, {
        path: 'user',
        select: 'name',
        model: 'User'
      })
      .yields('ER-ROR');

      let req = {
        params: {id: 5}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted to sleep!')
        }
      };
      let next = function(err) {
        err.should.equal('ER-ROR');
        ItemMock.verify();
        CommentMock.verify();
        done();
      };
      controller.getOne(req, res, next);
    });
  });
  describe('create()', () => {
    let create;
    before(() => {
      create = sinon.stub(Item, 'create')
    });
    after(() => {
      create.restore();
    });

    it('Should save req body to the collection and return new Obj', (done) => {
      UserMock.expects('update').withArgs({_id: undefined}, {$push: {'items': undefined}})
      .yields(null, {})
      create.yields(null, '01');

      let req = {
        body: {
          title: 'test'
        },
        payload: {
          _id: 5
        }
      };
      let res = {
        json: function(data) {
          data.should.equal('01');
          let i = create.getCalls()[0].args[0];
          i.user.should.equal(5);
          i.title.should.equal('test');
          should.exist(i.datePosted);
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to sleep!')
      };
      controller.create(req, res, next);
    });
    it('Should throw next with an error', (done) => {
      create.yields('ER-ROR');

      let req = {
        body: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON wanted to nap')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        done();
      };
      controller.create(req, res, next);
    });
  });
  describe('update()', () => {
    it('Should return message on success', (done) => {
      ItemMock.expects('update')
      .withArgs({_id: 5, user: 8}, {msg: 'testing ftw!'})
      .yields(null, {nModified: 1});

      let req = {
        params: {id: 5},
        body: {msg: 'testing ftw!'},
        payload: {_id: 8}
      };
      let res = {
        json: function(data) {
          data.message.should.equal('This entry has been updated!');
          ItemMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to sleep!')
      };
      controller.update(req, res, next);
    });
    it('Should call next if numRows were not modified', (done) => {
      ItemMock.expects('update')
      .yields(null, {nModified: 0});

      let req = {
        params: {},
        body: {},
        payload: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted to take a nap')
        }
      };
      let next = function(err) {
        err.message.should.equal('Unable to update entry');
        err.status.should.equal(500);
        ItemMock.verify();
        done();
      };
      controller.update(req, res, next);
    });
    it('Should throw next and return ER-ROR', (done) => {
      ItemMock.expects('update')
      .yields('ER-ROR');

      let req = {
        params: {},
        body: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON wanted to to f*ck in peace')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        ItemMock.verify();
        done();
      };
      controller.update(req, res, next);
    });
  });
  describe('remove()', () => {
    it('Should remove by id and return message on success', (done) => {
      ItemMock.expects('findOneAndRemove')
      .withArgs({_id: 5, user: 8})
      .yields(null, {});

      CommentMock.expects('remove')
      .withArgs({item: 5})
      .yields(null);

      let req = {
        params: {id: 5},
        payload: {_id: 8}
      };
      let res = {
        json: function(data) {
          data.message.should.equal('This entry has been removed');
          ItemMock.verify();
          CommentMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next really wanted some down-time');
      };
      controller.remove(req, res, next);
    });
    it('Should throw next on Comment.remove error', (done) => {
      ItemMock.expects('findOneAndRemove')
      .yields(null, {});
      CommentMock.expects('remove')
      .yields('ER-ROR');

      let req = {
        params: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON is pissed!')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        ItemMock.verify();
        CommentMock.verify();
        done();
      };
      controller.remove(req, res, next);
    });
    it('Should call next with message when Item cannot be found', (done) => {
      ItemMock.expects('findOneAndRemove')
      .yields(null);

      let req = {
        params: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON is hungry')}};
      let next = function(err) {
        err.message.should.equal('Unable to delete entry');
        err.status.should.equal(500);
        ItemMock.verify();
        done();
      };
      controller.remove(req, res, next);
    });
    it('Should call next for Item and return ER-ROR', (done) => {
      ItemMock.expects('findOneAndRemove')
      .yields('ER-ROR');

      let req = {
        params: {},
        payload: {}
      };
      let res = {json: () => {throw new Error('JSON is not ER-ROR!')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        ItemMock.verify();
        done();
      };
      controller.remove(req, res, next);
    });
  });
});

//muhahahaha ;D
