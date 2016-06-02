var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  email    : {
    type      : String,
    lowercase : true,
    unique    : true,
    required  : true
  },
  password : {
    type     : String,
    required : true
  },
  role     : {
    type    : String,
    enum    : ['Client', 'Manager', 'Admin'],
    default : 'Client'
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    next();
  }
  else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
