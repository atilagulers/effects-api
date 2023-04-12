const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'brand name must be provided'],
    trim: true,
    unique: true,
    maxlength: [30, 'A effect name must have less or equal then 30 characters'],
    minlength: [3, 'A effect name must have more or equal then 3 characters'],
  },

  icon: {
    type: String,
    default: null,
    //required: [true, 'brand icon must be provided'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Brand', brandSchema);
