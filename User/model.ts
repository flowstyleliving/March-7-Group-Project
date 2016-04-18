import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const SALT_ROUNDS = 1;

export interface IUserModel extends app.i.IUser, mongoose.Document{
  hashPassword(password:string, cb:(err, hash:string) => any);
  comparePassword(password:string, cb:(err, isMatch:boolean) => any);
  generateJWT(): string;
}

let userSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, trim: true, unique: true, sparse: true},
  password: {type: String},
  name: {type: String, required: true},
  img: {type: String, default: 'something.png'},
  aboutMe: {type: String},
	social: {
		provider: {type: String, lowercase: true, trim: true},
    url: {type: String}
	},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
 	categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
  facebook: {id: String, token: String},
  google: {id: String, token: String},
  twitter: {id: String, token: String},
  github: {id: String, token: String}
});

userSchema.method('hashPassword', function(password, done) {
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) return done(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return done(err);
      done(null, hash);
    });
  });
});
​
userSchema.method('comparePassword', function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return done(err);
    done(null, isMatch);
  });
});

userSchema.method('generateJWT', function() {
  return jwt.sign({
    name: this.name,
    email: this.email,
    img: this.img,
    _id: this._id
  }, process.env.JWT_SECRET);
});

export let User = mongoose.model<IUserModel>('User', userSchema);
