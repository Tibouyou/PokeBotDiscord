const mongoose = require('mongoose');

const baieSchema = mongoose.Schema({
  name: String,
  timeToGrow: Number,
  date: { 'type': Number, 'default': 0 },
  emoji: String,
  value: { 'type': Number, 'default': 1 },
  seedChance: { 'type': Number, 'default': 1 },
});

module.exports = mongoose.model('Baie', baieSchema);