const { Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton } = require('discord.js');

const buyable = {'pokeball':200, 'superball':600, 'hyperball':1800, 'masterball':25000, 'ceriz':50, "maron":100, "pecha":200, "fraive":300, "willia":500, "mepo":750, "oran":1500, "kika":3000, "prine":7500, "sitrus":15000};
const emoji = {'pokeball':'<:pokeBall:998163291543195709>', 'superball':'<:superBall:998163292654665768>', 'hyperball':'<:hyperBall:998163289114681374>', 'masterball':'<:masterBall:998163290293284945>', 'ceriz':'<:ceriz:998163243895894087>', "maron":"<:maron:998163247435890768>", "pecha":"<:pecha:998163250854248510>", "fraive":"<:fraive:998163244986404954>", "willia":"<:willia:998163254914326599>", "mepo":"<:mepo:998163248589328415>", "oran":"<:oran:998163249671450694>", "kika":"<:kika:998163246307622982>", "prine":"<:prine:998163252355797102>", "sitrus":"<:sitrus:998163253656031315>"};

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
    if (!(object in buyable)) return interaction.reply('Cet objet n\'existe pas !');
    const player = await Player.findOne({ id: interaction.user.id });
    const price = amount * buyable[object];
    interaction.reply({content :`Voulez vous vraiment acheter ${emoji[object]} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: [buttons]});
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
          i.update({content:`Vous avez bien acheté ${emoji[object]}${object} x${amount} pour ${price} <:pokepiece:998163328247529542>`, components: []});
        } else {
          i.update({content:`Achat annulé !`, components: []});
        }
      } else {
        i.reply({content: `Vous avez cliqué sur une commande qui n'est pas à vous`, ephemeral: true});
      }
    });
  }
}
