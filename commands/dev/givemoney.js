const { Player } = require('../../models/listmodel');

module.exports = {
  name: 'givemoney',
  ownerOnly: true,
  description: 'placeholder',
  options: [
    {
      name: 'target',
      description: 'Choisir la personne à give',
      type: 'USER',
      required: true,
    },
    {
      name: 'amount',
      description: 'Choisir le nombre d\'argent à donner',
      type: 'NUMBER',
      required: true,
    }
  ],
  async runInteraction(client, interaction) {
    const target = interaction.options.getUser('target');
    const amount = interaction.options.getNumber('amount');
    const player = await Player.findOne({ id: target.id });
    player.money += amount;
    player.save();
    
    interaction.reply(`${amount} pokécoins ajoutés à ${target} !`);
  }
}