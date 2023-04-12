const mongoose = require('mongoose');

const effectSchema = new mongoose.Schema({
  brand: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Brand',
    required: [true, 'effect client must be provided'],
  },
  name: {
    type: String,
    required: [true, 'effect name must be provided'],
    unique: true,
    trim: true,
    maxlength: [50, 'A effect name must have less or equal then 50 characters'],
    minlength: [3, 'A effect name must have more or equal then 3 characters'],
  },
  team: {
    type: String,
    trim: true,
    enum: {
      values: ['Neuromancer', 'Contact', 'Ubik'],
      message: '{VALUE} is not supported',
    },
    required: [true, 'team name must be provided'],
  },
  category: {
    type: String,
    enum: {
      values: [
        'Beauty',
        'Consumer Goods',
        'Entertainment',
        'Healthcare',
        'Restaurant',
        'Retail',
        'Technology',
        'Other',
      ],
      message: '{VALUE} is not supported',
    },
    required: [true, 'effect category must be provided'],
  },
  tags: {
    type: [String],
    required: [true, 'effect tag must be provided'],
  },
  lensType: {
    type: String,
    enum: {
      values: ['LL', 'Core', 'Bespoke', 'Innovation'],
      message: '{VALUE} is not supported',
    },
    required: [true, 'effect category must be provided'],
  },
  icon: {
    type: String,
    default: null,
  },
  preview: {
    type: String,
    default: null,
  },
  liveDate: {
    type: Date,
    required: [true, 'effect live-date must be provided'],
  },
  driveURL: {
    type: String,
    //required: [true, 'effect drive-url must be provided'],
  },
  videoURL: {
    type: String,
    //required: [true, 'effect video-url must be provided'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Effect', effectSchema);
