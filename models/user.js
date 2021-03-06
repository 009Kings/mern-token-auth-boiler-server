const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  email: { // TODO: Need to add email validation
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 99
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 99
  }
});

// Override 'toJSON' to prevent the password from being returned with the user
userSchema.set('toJSON', {
  transform: function(doc, user) { // There is a third parameter called options that isn't needed
    const userJSON = {
      id: user._id,
      email: user.email,
      name: user.name
    }
    return userJSON;
  } 
});

// A helper function to authenticate with bcrypt
userSchema.methods.isAuthenticated = function(password) {
  return bcrypt.compareSync(password, this.password)
}

// Mongoose's version of a beforeCreate hook
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
})

// Exporting the User model
module.exports = mongoose.model('User', userSchema);
