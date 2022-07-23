const mongoose = require('mongoose');

const farmSchema = mongoose.Schema({
  level: { 'type': Number, 'default': 1 },
  plantations: { 'type': Array, 'default': [] },
});

module.exports = mongoose.model('Farm', farmSchema);