"use strict";
let should = require('should');
let controller = require('../../User/controller');
let User = require('../../User/model').User;
let Item = require('../../Item/model').Item;
let sinon = require('sinon');
let nodemailer = require('nodemailer');
let crypto = require('crypto');
require('sinon-as-promised');
require('sinon-mongoose');
let transporter = require('../../utils/mailerHelper').transporter;



describe('User Controller', () => {
  let UserMock, ItemMock, hashStub, MailMock;
  beforeEach((done) => {
    UserMock = sinon.mock(User);
    ItemMock = sinon.mock(Item);
    MailMock = sinon.mock(transporter);
    hashStub = sinon.stub(User.prototype, 'hashPassword');
    done();
  });
  afterEach((done) => {
    UserMock.restore();
    ItemMock.restore();
    MailMock.restore();
    hashStub.restore();
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
      hashStub.yields(null, 'hash')

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
    });
    it('Should throw next with an error', (done) => {
      UserMock.expects('create')
      .yields({message: 'data and salt arguments required'})
      hashStub.yields(null)


      let req = {
        body: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted to be sleeping')
        }
      };
      let next = function(err) {
        err.message.should.equal('data and salt arguments required');
        UserMock.verify();
        done();
      };
      controller.register(req, res, next);
    });
    it('Should throw next with an error if pw does not hash', (done) => {
      UserMock.expects('create')
      .yields(null, {
        generateJWT: function(err, cb) {
          return 'abc';
        }
      });
      hashStub.yields('data and salt arguments required');

      let req = {
        body: {}
      };
      let res = {json: () => {throw new Error('JSON wanted to nap!')}};
      let next = function(err) {
        err.should.equal('data and salt arguments required');
        done();
      };
      controller.register(req, res, next);
    });
  });

  describe('forgot()', () => {
    it('Should find user by email and send reset email', (done) => {


      UserMock.expects('findOne').withArgs({email: 'test@e.mail'})
      .chain('exec')
      .yields(null, {user: 'test@e.mail', save: function(cb){
        cb(null);
      }})

      let cryptoStub = sinon.stub(crypto, "randomBytes");
      cryptoStub.yields(null, {token: 'abc'})

      MailMock.expects('sendMail').withArgs({
        from: "Folio Team <folioteamcc@gmail.com>",
        html: "Hey undefined,<br><br>We heard you forgot your password. There are 2 steps to reset:<br>1) Here is your reset token. It expires within an hour from when you requested to reset your password: <strong>[object Object]</strong><br><br>2) Click on the link below to reset<br>http://localhost:3000/resetPassword<br><br>If you did not request a reset, please ignore this email. Your password will not be reset.<br><br>Have a great day!<br><br>xo,<br>The Folio Team",
        subject: "Folio Password Reset",
        to: undefined
      })
      .yields(null)

      let req = {
        params: {
          token: 'abc'
        },
        body: {email: 'test@e.mail'}
      };
      let res = {
        json: function(data) {
          cryptoStub.restore();
          data.user.resetPasswordToken.should.equal(undefined);
          data.token.should.exist(true);
          done();
        },
        redirect: function(data){
          should.exist('/')
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted Nap')
      };
    controller.forgot(req, res, next);
    });
    it('Should throw next when user is not found and message', (done) => {
      UserMock.expects('findOne')
      .chain('exec')
      .yields({message: 'Invalid user'})

      let req = {
        body: {}
      };
      let res = {
        json: function() {
          throw new Error('JSON wanted to nap')
        }
      };
      let next = function(err) {
        err.message.should.equal('Invalid user')
        done();
      };
      controller.forgot(req, res, next);
    });
  });
  describe('resetPassword()', () => {
    it('Should find user and send pw reset success email', (done) => {
      UserMock.expects('findOne').withArgs({ resetPasswordDate: {$gt: sinon.match.number}, resetPasswordToken: "abc" })
      .chain('exec')
      .yields(null, {user: 'abc', save: function(cb) {
        cb(null, {user: 'abc'})
      }, hashPassword: function(password, hash) {hash(null)}
      });

      MailMock.expects('sendMail').withArgs({
        from: "Folio Team <folioteamcc@gmail.com>",
        html: "Hey undefined,<br><br>Looks like you were able to update your password!<br><br>If you did not reset it, please contact the Folio Team right away by replying to this email.<br><br>Have a great day!<br><br>xo,<br>The Folio Team",
        subject: "Your Folio Password Has Been Updated!",
        to: undefined
      }).yields(null);

      let req = {
        body: {
          token: 'abc',
          password: undefined
        }
      };
      let res = {
        redirect: function(data) {
          should.exist('/');
          UserMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to nap')
      };
      controller.resetPassword(req, res, next)
    });
    it('Should throw next if user cannot be found through a token with a message', (done) => {
      UserMock.expects('findOne')
      .chain('exec')
      .yields({message: 'Invalid token!'})

      let req = {
        body: {}
      };
      let res = {json: () => {throw new Error('JSON wanted to nap')}};
      let next = function(err) {
        err.message.should.equal('Invalid token!');
        done();
      };
      controller.resetPassword(req, res, next);
    });
  });
  describe('findAll', () => {
    it('Should find All users', (done) => {
      UserMock.expects('find').withArgs({})
      .chain('select', '-password', '-facebook')
      .chain('exec')
      .yields(null, {})

      let req = {};
      let res = {
        json: function(data) {
          data.should.exist;
          done();
        }
      };
      let next = function() {
        throw new Error('Next wanted to be safe')
      };
      controller.findAll(req, res, next);
    });
    it('Should throw next with an error', (done) => {
      UserMock.expects('find').withArgs({})
      .chain('select', '-password', '-facebook')
      .chain('exec')
      .yields('ER-ROR');

      let req = {};
      let res = {json: () => {throw new Error('JSON says no')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        done();
      };
      controller.findAll(req, res, next);
    });
  });

  describe('findOne()', () => {
    it('Should findOne by id and return it', (done) => {
      UserMock.expects('findOne').withArgs({_id: 5})
      .chain('select', '-password', '-facebook')
      .chain('populate', 'items', 'title images description datePosted dateComplete notes category')
      .chain('exec')
      .yields(null, {items: 2})

      ItemMock.expects('populate')
      .withArgs(2, {
        path: 'user',
        select: 'name',
        model: 'User'
      })
      .yields(null, 2)

      let req = {
        params: {
          id: 5
        }
      };
      let res = {
        json: function(data) {
          data.items.should.equal(2)
          UserMock.verify();
          ItemMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next was a no')
      };
      controller.findOne(req, res, next);
    });
    it('Should throw next with an error if id cannnot be found', (done) => {
      UserMock.expects('findOne')
      .chain('select', '-password', '-facebook')
      .chain('populate', 'items', 'title images description datePosted dateComplete notes category')
      .chain('exec')
      .yields('ER-ROR')

      let req = {
        params: {}
      };
      let res = {json: () => {throw new Error('JSON says no')}};
      let next = function(err) {
        err.should.equal('ER-ROR');
        done();
      };
      controller.findOne(req, res, next);
    });
    it('Should throw next on item populate with an error', (done) => {
      UserMock.expects('findOne').withArgs({_id: 5})
      .chain('select', '-password', '-facebook')
      .chain('populate', 'items', 'title images description datePosted dateComplete notes category')
      .chain('exec')
      .yields(null, {});

      ItemMock.expects('populate')
      .yields('ER-ROR');

      let req = {
        params: {id: 5}
      };
      let res = {
        json: function() {
          throw new Error('JSON says no')
        }
      };
      let next = function(err) {
        err.should.equal('ER-ROR');
        done();
      };
      controller.findOne(req, res, next);
    });
  });

  describe('update()', () => {
    it('Should update User and return success message', (done) => {
      UserMock.expects('update').withArgs({_id: 5})
      .yields(null, {})

      let req = {
        params: {id: 5},
        body: {}
      };
      let res = {
        json: function(data) {
          data.message.should.equal('Updated');
          UserMock.verify();
          done();
        }
      };
      let next = function() {
        throw new Error('Next says Nope')
      };
      controller.update(req, res, next);
    });
    it('Should throw next with an error if id cannont be found', (done) => {
      UserMock.expects('update')
      .yields('ER-ROR');

      let req = {
        params: {},
        body: {}
      };
      let res = {
        json: () => {throw new Error('Nah says JSON')}
      };
      let next = function(err) {
        err.should.equal('ER-ROR');
        done();
      };
      controller.update(req, res, next);
    });
  });
});
