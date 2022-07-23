const { Player } = require('../../models/listmodel');

module.exports = {
  name: 'givepokeball',
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
      name: 'pokeball',
      description: 'Choisir le type de pokéball',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'pokeball',
          value: 'pokeball'
        },
        {
          name: 'superball',
          value: 'superball'
        },
        {
          name: 'hyperball',
          value: 'hyperball'
        },
        {
          name: 'masterball',
          value: 'masterball'
        }
      ]
    },
    {
      name: 'amount',
      description: 'Choisir le nombre de pokéball à give',
      type: 'NUMBER',
      required: true,
    },
  ],
  async runInteraction(client, interaction) {
    const target = interaction.options.getUser('target');
    const pokeballType = interaction.options.getString('pokeball').toLowerCase();
    const amount = interaction.options.getNumber('amount');
    const player = await Player.findOne({ id: target.id });
    console.log(player.inventory[pokeballType]);
    player.inventory[pokeballType] += amount;
    console.log(player.inventory[pokeballType]);
    player.markModified('inventory')
    player.save();
    
    interaction.reply(`${amount} ${pokeballType} ajoutés à ${target} !`);
  }
}
