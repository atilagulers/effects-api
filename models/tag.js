const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tag name must be provided'],
    trim: true,
    maxlength: [30, 'A effect name must have less or equal then 30 characters'],
    minlength: [3, 'A effect name must have more or equal then 3 characters'],
  },
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Tag', tagSchema);
