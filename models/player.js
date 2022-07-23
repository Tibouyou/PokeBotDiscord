const mongoose = require('mongoose');
const Farm = require('../models/farm').schema;
const Inventory = require('../models/inventory').schema;



const playerSchema = mongoose.Schema({
  id: String,
  level: { 'type': Number, 'default': 0 },
  money: { 'type': Number, 'default': 0 },
  pokemon: { 'type': Array, 'default': [] },
  pokedex: { 'type': Number, 'default': 0 },
  inventory: Inventory,
  farm: Farm
});

module.exports = mongoose.model('Player', playerSchema);