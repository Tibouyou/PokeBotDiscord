const { Player, Baie } = require('../../models/listmodel');


module.exports = {
  name: 'plant',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'baie',
      description: 'Choisir la baie à planter',
      type: 'STRING',
      required: true,
    },
  ],  
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const farm = player.farm;
    const freePlot = farm.level - farm.plantations.length;
    if(!freePlot) return interaction.reply('Pas de champ disponible');
    const baieName = interaction.options.getString('baie').toLowerCase();
    const baie = await Baie.findOne({ name: baieName });
    if(player.inventory[baieName] == 0) return interaction.reply('Vous ne possédez pas ce type de baie');
    const createBaie = await new Baie({name: baieName, timeToGrow: baie.timeToGrow, date: parseInt(Date.now()/1000), emoji: baie.emoji, value: baie.value, seedChance: baie.seedChance});
    player.farm.plantations.push(createBaie);
    player.markModified('farm');
    player.save();
    player.inventory[baieName] -= 1;
    player.markModified('inventory');
    interaction.reply(`Baie ${createBaie.name} plantée dans le champ numéro ${player.farm.plantations.length}`);
  }
}