const { Player, Farm, Inventory } = require('../../models/listmodel');

module.exports = {
  name: 'play',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const createFarm = await new Farm();
    const createInventory = await new Inventory();
    const createPlayer = await new Player({ id: interaction.user.id, farm: createFarm, inventory: createInventory});
    createPlayer.save().then(p => console.log(`Nouveau joueur (${p.id})`));
    interaction.reply('Joueur ajouté dans la BDD');
  }
}