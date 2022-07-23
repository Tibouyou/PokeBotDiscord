const { Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton } = require('discord.js');

const buyable = ['pokeball', 'superball', 'hyperball', 'masterball', 'ceriz'];

const buttons = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('confirm')
      .setLabel('OUI')
      .setStyle('SUCCESS'),
      
    new MessageButton()
      .setCustomId('refuse')
      .setLabel('NON')
      .setStyle('DANGER'),
  )  

module.exports = {
  name: 'buy',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'object',
      description: 'Choisir l\'objet à acheter',
      type: 'STRING',
      required: true,
    },
    {
      name: 'amount',
      description: 'Choisir le nombre de pokéball à acheter',
      type: 'NUMBER',
      required: true,
    },
  ],
  async runInteraction(client, interaction) {
    const object = interaction.options.getString('object').toLowerCase();
    const amount = interaction.options.getNumber('amount');
    if (!buyable.includes(object)) return interaction.reply('Cet object n\'existe pas !');
    const player = await Player.findOne({ id: interaction.user.id });
    let emoji;
    let price;
    if (object == 'pokeball') {
      emoji = '<:pokeBall:998163291543195709>';
      price = amount * 200;
      interaction.reply({content :`Voulez vous vraiment acheter ${emoji} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
    } else if (object == 'superball'){
      emoji = '<:superBall:998163292654665768>';
      price = amount * 600;
      interaction.reply({content :`Voulez vous vraiment acheter ${emoji} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
    } else if (object == 'hyperball'){
      emoji = '<:hyperBall:998163289114681374>';
      price = amount * 1200;
      interaction.reply({content :`Voulez vous vraiment acheter ${emoji} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
    } else if (object == 'masterball'){
      emoji = '<:masterBall:998163290293284945>';
      price = amount * 50000;
      interaction.reply({content :`Voulez vous vraiment acheter ${emoji} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
    } else if (object == 'ceriz'){
      emoji = '<:ceriz:998163243895894087>';
      price = amount * 50;
      interaction.reply({content :`Voulez vous vraiment acheter ${emoji} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
    }    
    const message = await interaction.fetchReply();
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
    collector.on('collect', async i => {
      if (i.user.id === interaction.user.id) {
        if (i.customId === 'confirm') {
          if (player.money < price) return i.update({content: `Il vous manque ${price - player.money} <:pokepiece:998163328247529542>`, components: []});
          player.inventory[object] += amount;
          player.markModified('inventory');
          player.money -= price;
          player.save();
          i.update({content:`Vous avez bien acheté ${emoji}${object} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: []});
        } else {
          i.update({content:`Achat annulé !`, components: []});
        }
      } else {
        i.reply({content: `Vous avez cliqué sur une commande qui n'est pas à vous`, ephemeral: true});
      }
    });
  }
}
