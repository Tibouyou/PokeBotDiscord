const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Baie, Player } = require('../../models/listmodel');

const ball = ["pokeball", "superball", "hyperball", "masterball"];
const berry = ["ceriz", "maron", "pecha", "fraive", "willia", "mepo", "oran", "kika", "prine", "sitrus"];
const cost = {"ceriz":50, "maron":100, "pecha":200, "fraive":300, "willia":500, "mepo":750, "oran":1500, "kika":3000, "prine":7500, "sitrus":15000};

function formatNumber(second){
  if (second < 3600) return `(${second/60}m)`;
  return `(${second/60/60}H)`;
}

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
    .setDescription('<:pokeBall:998163291543195709> pokeball : 800 <:pokepiece:998163328247529542>\n<:superBall:998163292654665768> superball : 1200 <:pokepiece:998163328247529542>\n<:hyperBall:998163289114681374> hyperball : 2000 <:pokepiece:998163328247529542>\n<:masterBall:998163290293284945> masterball : 30000 <:pokepiece:998163328247529542>\n')
    .setTimestamp()
    .setColor('#cf102a')
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });

    let berryString = '';
    for(let i = 0; i < berry.length; i ++) {
      const baie = await Baie.findOne({name: berry[i]});
      berryString += `${baie.emoji} ${berry[i]} : ${cost[berry[i]]} <:pokepiece:998163328247529542> ${formatNumber(baie.timeToGrow)}\n`;
    }

    const embedBerry = new MessageEmbed()
    .setTitle('Shop')
    .setDescription(berryString)
    .setTimestamp()
    .setColor('#cf102a')
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