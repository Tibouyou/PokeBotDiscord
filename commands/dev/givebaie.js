const { Player } = require('../../models/listmodel');

module.exports = {
  name: 'givebaie',
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
      name: 'baie',
      description: 'Choisir le type de baie',
      type: 'STRING',
      required: true,
    },
    {
      name: 'amount',
      description: 'Choisir le nombre de baie à give',
      type: 'NUMBER',
      required: true,
    },
  ],
  async runInteraction(client, interaction) {
    const target = interaction.options.getUser('target');
    const baieType = interaction.options.getString('baie').toLowerCase();
    const amount = interaction.options.getNumber('amount');
    const player = await Player.findOne({ id: target.id });
    player.inventory[baieType] += amount;
    player.markModified('inventory')
    player.save();
    
    interaction.reply(`${amount} ${baieType} ajoutés à ${target} !`);
  }
}
