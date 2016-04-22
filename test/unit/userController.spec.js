"use strict";
let should = require('should');
let controller = require('../../User/controller');
let User = require('../../User/model').User;
let sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');


describe('User Controller', () => {
  let UserMock;
  beforeEach((done) => {
    UserMock = sinon.mock(User);
    done();
  });
  afterEach((done) => {
    UserMock.restore();
    done();
  });

  describe('login()', (done) => {
    it('Should find one user by email and return a jwt', (done) => {
      UserMock.expects('findOne').withArgs({email: 'test@e.mail'})
      .chain('exec')
      .yields(
        null, {
          email: 'test@e.mail',
          comparePassword: function(password, cb) {
            password.should.equal('shhh');
            cb(null, true);
          },
          generateJWT: function() {
            return 'abc';
          }
      });

      let req = {
        body: {
          email: 'test@e.mail',
          password: 'shhh'
        }
      };
      let res = {
        json: function(data) {
          data.token.should.equal('abc');
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to sleep');
      };
      controller.login(req, res, next);
    });
    it('Should call next when email is not found and return error message', (done) => {
      UserMock.expects('findOne')
      .chain('exec')
      .yields(null);

      let req = {
        body: {}
      };
      let res = {json: () => {throw new Error('JSON wanted to nap')}};
      let next = function(err) {
        err.message.should.equal('Invalid login.');
        done();
      };
      controller.login(req, res, next);
    });
    it('Should call next when pw does not match and return err message', (done) => {
      UserMock.expects('findOne').withArgs({email: 'test@e.mail'})
      .chain('exec')
      .yields(null, {
        email: 'test@e.mail',
        comparePassword: function(password, cb) {
          cb(null, false);
        }
      });

      let req = {
        body: {
          email: 'test@e.mail'
        }
      };
      let res = {
        json: function() {
          throw new Error('WTF BRO, JSON wants to nap!')
        }
      };
      let next = function(err) {
        err.message.should.equal('Invalid login.');
        done();
      };
      controller.login(req, res, next);
    });
  });

  describe('register()', () => {
    it('Should create a new User with a hashed pw and return a jwt token', (done) => {
      UserMock.expects('create')
      .yields(null, {
        generateJWT: function(err, cb) {
          return 'abc';
        }
      });
      let hashStub = sinon.stub(User.prototype, 'hashPassword')
      hashStub.yields(null, 'macaroni');

      let req = {
        body: {
          password: 'potato'
        }
      };
      let res = {
        json: function(data) {
          let u = hashStub.getCalls()[0].args[0];
          u.should.equal('potato');
          data.token.should.equal('abc');
          done();
        }
      };
      let next = function() {
        throw new Error('Next wants to eat fried macaroni salad!')
      };
      controller.register(req, res, next);
    })
  })
});
