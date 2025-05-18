// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { /* ... */ },
  dob: { type: Date },
  profilePictureUrl: { type: String, default: '' },
}, { timestamps: true });
// ... (password methods) ...
module.exports = mongoose.model('User', UserSchema);