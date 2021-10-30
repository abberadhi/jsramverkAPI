let { Schema, model } = require('mongoose');

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

const User = model('users', UserSchema);

module.exports = User;