const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the UserSchema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique across users
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Sets the current date by default
  },
});

// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
