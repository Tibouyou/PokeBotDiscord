const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
  number: Number,
  name: String,
  emoji: String,
  emojiShiny: String,
  zone: Number,
  isShiny: { 'type': Boolean, 'default': false }, 
  pc: { 'type': Number, 'default': 0 }, 
});

module.exports = mongoose.model('Pokemon', pokemonSchema);
