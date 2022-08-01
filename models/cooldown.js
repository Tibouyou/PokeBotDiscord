const mongoose = require('mongoose');

const cooldownSchema = mongoose.Schema({
  name: String,
  users: { 'type': Array, 'default': [] },
});

module.exports = mongoose.model('Cooldown', cooldownSchema);