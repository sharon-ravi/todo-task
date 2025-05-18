const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false }, // Ensure this is here
  isForToday: { type: Boolean, default: false },  // Ensure this is here
  dueDate: { type: Date, default: null },      // Optional, good to have
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);