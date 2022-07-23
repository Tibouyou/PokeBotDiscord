const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'shop',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const buttonBerry = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('berry')
        .setEmoji('<:ceriz:998163243895894087>')
        .setStyle('SECONDARY'),
    )  
    const buttonBall = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('ball')
        .setEmoji('<:pokeBall:998163291543195709>')
        .setStyle('SECONDARY'),
    )  
    const embedBall = new MessageEmbed()
    .setTitle('Shop')
    .setDescription('<:pokeBall:998163291543195709> Pokéball : 200 <:pokepiece:998163328247529542>\n<:superBall:998163292654665768> Superball : 600 <:pokepiece:998163328247529542>\n<:hyperBall:998163289114681374> Hyperball : 1200 <:pokepiece:998163328247529542>\n<:masterBall:998163290293284945> Masterball : 50000 <:pokepiece:998163328247529542>\n')
    .setTimestamp()
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });

    const embedBerry = new MessageEmbed()
    .setTitle('Shop')
    .setDescription('<:ceriz:998163243895894087> Ceriz : 50 <:pokepiece:998163328247529542>')
    .setTimestamp()
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });
  
    interaction.reply({embeds: [embedBall] , components: [buttonBerry]});
    const message = await interaction.fetchReply();
    const collector = message.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.customId === 'berry') {
        i.update({embeds: [embedBerry] , components: [buttonBall]});
      } else {
        i.update({embeds: [embedBall] , components: [buttonBerry]});
      }
    });
  }
}