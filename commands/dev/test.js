const Pokemon = require('../../models/pokemon');
const Pokeball = require('../../models/listmodel');

module.exports = {
  name: 'test',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    console.log(Pokemon);
    console.log(Pokemon.findOne({ number: 1 }));
    console.log(Pokeball);
  }
}