const { Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton } = require('discord.js');

const cost = [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000];

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
  name: 'upgrade',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'upgrade',
      description: 'Choisir ce que vous voulez améliorer',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'farm',
          value: 'farm'
        },
        {
          name: 'encens',
          value: 'encens'
        }
      ]
    },
  ],
  async runInteraction(client, interaction) {
    const upgradeType = interaction.options.getString('upgrade');
    let player = await Player.findOne({ id: interaction.user.id });
    if (upgradeType == "farm") {
      if (player.farm.level == cost.length) return interaction.reply('Votre ferme est déjà au niveau maximum');
      interaction.reply({content :`Voulez vous vraiment améliorer votre ferme au niveau ${player.farm.level+1} pour ${cost[player.farm.level-1]} <:pokepiece:998163328247529542>`, components: [buttons]});
      const message = await interaction.fetchReply();
      const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
      collector.on('collect', async i => {
        if (i.user.id === interaction.user.id) {
          if (i.customId === 'confirm') {
            if (player.money < cost[player.farm.level-1]) return i.update({content: `Il vous manque ${cost[player.farm.level-1] - player.money} <:pokepiece:998163328247529542>`, components: []});
            player.farm.level += 1;
            player.markModified('farm');
            player.money -= cost[player.farm.level-2];
            player.save();
            i.update({content:`Vous avez bien améliorer votre ferme au niveau ${player.farm.level}`, components: []});
          } else {
            i.update({content:`Achat annulé !`, components: []});
          }
        } else {
          i.reply({content: `Vous avez cliqué sur une commande qui n'est pas à vous`, ephemeral: true});
        }
      });
    } else {
      if (player.encens == 100) return interaction.reply('Votre encens est déjà au niveau maximum');
      interaction.reply({content :`Voulez vous vraiment améliorer votre encens au niveau ${player.encens+1} pour ${2500*(player.encens+1)} <:pokepiece:998163328247529542>`, components: [buttons]});
      const message = await interaction.fetchReply();
      const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
      collector.on('collect', async i => {
        if (i.user.id === interaction.user.id) {
          if (i.customId === 'confirm') {
            if (player.money < 2500*(player.encens+1)) return i.update({content: `Il vous manque ${2500*(player.encens+1) - player.money} <:pokepiece:998163328247529542>`, components: []});
            player.encens += 1;
            player.money -= 2500*(player.encens);
            player.save();
            i.update({content:`Vous avez bien améliorer votre encens au niveau ${player.encens} vous avez maintenant ${(((0.80 - 1/player.currentZone)/100*player.encens+1/player.currentZone)*100).toFixed(2)} % de chance de capturer un pokémon de votre zone actuelle (${player.currentZone})`, components: []});
          } else {
            i.update({content:`Achat annulé !`, components: []});
          }
        } else {
          i.reply({content: `Vous avez cliqué sur une commande qui n'est pas à vous`, ephemeral: true});
        }
      });
    }
  }
}