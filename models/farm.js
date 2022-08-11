const mongoose = require('mongoose');

const farmSchema = mongoose.Schema({
  level: { 'type': Number, 'default': 1 },
  engrais: { 'type': Number, 'default': 0 },
  plantations: { 'type': Array, 'default': [] },
});

module.exports = mongoose.model('Farm', farmSchema);