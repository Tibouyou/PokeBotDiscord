const { Pokemon } = require('../../models/listmodel');

module.exports = {
  name: 'update',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    await Pokemon.updateMany({}, { "$set": { "isShiny": false }, upsert: true });
    interaction.reply('Nouvelles données ajoutées!')
  }
}