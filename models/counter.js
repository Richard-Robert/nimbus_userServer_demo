var mongoose = require('mongoose');

var counterSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    sequence_value: Number
  },
  { collection: 'Counters' }
);

// Build the counter model
mongoose.model('Counter', counterSchema);
