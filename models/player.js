const mongoose = require('mongoose');
const Farm = require('../models/farm').schema;
const Inventory = require('../models/inventory').schema;



const playerSchema = mongoose.Schema({
  id: String,
  currentZone: { 'type': Number, 'default': 1 },
  money: { 'type': Number, 'default': 100 },
  pokemon: { 'type': Array, 'default': [] },
  pokedex: { 'type': Number, 'default': 0 },
  inventory: Inventory,
  farm: Farm
});

module.exports = mongoose.model('Player', playerSchema);