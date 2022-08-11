const { Player } = require('../../models/listmodel');

module.exports = {
  name: 'encens',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    interaction.reply(`Au niveau ${player.encens}, vous avez ${(((0.80 - 1/player.currentZone)/100*player.encens+1/player.currentZone)*100).toFixed(2)} % de chance de capturer un pokémon de la zone ${player.currentZone} !`);
  }
}