const { Baie } = require('../../models/listmodel');

module.exports = {
  name: 'newbaie',
  ownerOnly: true,
  description: 'placeholder',
  options: [
    {
      name: 'name',
      description: 'Choisir le nom de la baie',
      type: 'STRING',
      required: true,
    },
    {
      name: 'timetogrow',
      description: 'Choisir le temps de pousse',
      type: 'NUMBER',
      required: true,
    },
    {
      name: 'emoji',
      description: 'Choisir l\'émojie de la baie',
      type: 'STRING',
      required: true,
    },
    {
      name: 'value',
      description: 'Choisir la valeur de la baie',
      type: 'NUMBER',
      required: true,
    }
  ],
  async runInteraction(client, interaction) {
    const timeToGrow = interaction.options.getNumber('timetogrow');
    const name = interaction.options.getString('name');
    const emoji = interaction.options.getString('emoji');
    const value = interaction.options.getNumber('value');

    const createBaie = await new Baie({ name: name, timeToGrow: timeToGrow, emoji: emoji, value: value });
    createBaie.save().then(p => interaction.reply(`Nouvelle baie (${p.emoji} ${p.name})`));
  }
}