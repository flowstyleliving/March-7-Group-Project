"use strict";
let should = require('should');
let User = require('../../User/model').User;
let atob = require('atob');

describe('User Model', () => {
  describe('hashPassword()', () => {
    it('Should return a hash string that does not equal the inital string', (done) => {
      let u = new User();
      u.hashPassword('test', (err, hash) => {
        should.not.exist(err);
        should.exist(true);
        hash.should.not.equal('test');
        done();
      });
    });
  });
  describe('comparePassword', () => {
    let u = new User();
    before((done) => {
      u.hashPassword('secret', (err, hash) => {
        u.password = hash;
        done();
      });
    });
    it('Should return true on isMatch', (done) => {
      u.comparePassword('secret', (err, isMatch) => {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      });
    });
    it('Should return false on isMatch', (done) => {
      u.comparePassword('nope', (err, isMatch) => {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      });
    });
  });
  describe('generateJWT()', () => {
    it('Should return jwt with 3 parts (header, payload, signature)', (done) => {
      let u = new User();
      process.env.JWT_SECRET='test';
      u.name = 'name';
      u.email= 'e@mail.com';
      u.img = 'img.png';
      let token = u.generateJWT();

      should.exist(token);
      token.split('.').length.should.equal(3);
      let t = JSON.parse(atob(token.split('.')[1]));
      t._id.should.equal(u._id.toString());
      t.name.should.equal('name');
      t.email.should.equal('e@mail.com');
      t.img.should.equal('img.png');
      done();
    });
  });
  describe('validation', () => {
    let u = User.schema.tree;
    it('Should have name required', (done) => {
      u.name.required.should.equal(true);
      done();
    });
    it('Should have email: lowercase, trim, unique & spare', (done) => {
      let e = u.email;
      e.lowercase.should.equal(true);
      e.trim.should.equal(true);
      e.unique.should.equal(true);
      e.sparse.should.equal(true);
      done();
    });
    it('Should ref Comment and Item correctly', (done) => {
      u.comments[0].ref.should.equal('Comment');
      u.items[0].ref.should.equal('Item');
      done();
    });
    it('Should have social.provider: lowercase & trim', (done) => {
      let s = u.social[0].provider;
      s.lowercase.should.equal(true);
      s.trim.should.equal(true);
      done();
    });
  });
});
