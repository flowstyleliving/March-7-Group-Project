"use strict";
let should = require('should');
let controller = require('../../Item/controller');
let Item = require('../../Item/model').Item;
let Comment = require('../../Comment/model').Comment;
let sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');

let ItemMock, CommentMock;
beforeEach((done) => {
  ItemMock = sinon.mock(Item);
  CommentMock = sinon.mock(Comment);
  done();
});
afterEach((done) => {
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
    beforeEach(() => {
      create = sinon.stub
    })
    it('Should return success')
  })
})
