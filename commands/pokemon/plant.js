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
    {
      name: 'amount',
      description: 'Le nombre de baie à planter',
      type: 'NUMBER',
      required: false,
    }
  ],  
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const farm = player.farm;
    let amount = interaction.options.getNumber('amount');
    if (!amount) amount = 1;
    const freePlot = farm.level - farm.plantations.length;
    if(!(freePlot >= amount)) return interaction.reply('Pas de assez de champ disponible');
    const baieName = interaction.options.getString('baie').toLowerCase();
    const baie = await Baie.findOne({ name: baieName });
    if (baie == null) return interaction.reply('Ce type de baie n\'existe pas');
    if(player.inventory[baieName] < amount) return interaction.reply('Vous ne possédez pas assez de ce type de baie');
    const createBaie = await new Baie({name: baieName, timeToGrow: baie.timeToGrow, date: parseInt(Date.now()/1000), emoji: baie.emoji, value: baie.value, seedChance: baie.seedChance});
    for (let i = 0; i < amount; i++) {
      player.farm.plantations.push(createBaie);
    }
    player.markModified('farm');
    player.save();
    player.inventory[baieName] -= amount;
    player.markModified('inventory');
    interaction.reply(`${amount} baie(s) ${createBaie.name} plantée(s) !`);
  }
}