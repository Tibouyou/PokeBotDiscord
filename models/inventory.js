const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  ceriz: { 'type': Number, 'default': 0 },
  maron: { 'type': Number, 'default': 0 },
  pecha: { 'type': Number, 'default': 0 },
  fraive: { 'type': Number, 'default': 0 },
  willia: { 'type': Number, 'default': 0 },
  mepo: { 'type': Number, 'default': 0 },
  oran: { 'type': Number, 'default': 0 },
  kika: { 'type': Number, 'default': 0 },
  prine: { 'type': Number, 'default': 0 },
  sitrus: { 'type': Number, 'default': 0 },
  pokeball: { 'type': Number, 'default': 0 },
  superball: { 'type': Number, 'default': 0 },
  hyperball: { 'type': Number, 'default': 0 },
  masterball: { 'type': Number, 'default': 0 },
});

module.exports = mongoose.model('Inventory', inventorySchema);
