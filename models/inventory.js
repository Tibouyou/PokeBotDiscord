const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  ceriz: { 'type': Number, 'default': 0 },
  pokeball: { 'type': Number, 'default': 0 },
  superball: { 'type': Number, 'default': 0 },
  hyperball: { 'type': Number, 'default': 0 },
  masterball: { 'type': Number, 'default': 0 },
});

module.exports = mongoose.model('Inventory', inventorySchema);
