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
  });
});
