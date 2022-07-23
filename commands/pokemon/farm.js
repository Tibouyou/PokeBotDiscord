const { MessageEmbed } = require('discord.js');
const { Player } = require('../../models/listmodel');


module.exports = {
  name: 'farm',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    let player = await Player.findOne({ id: interaction.user.id });
    const farm = player.farm;
    const freePlot = farm.level - farm.plantations.length;
    let val = `Baies : <:ceriz:998163243895894087> ${player.inventory.ceriz} \n`;
    for (let i = 0; i < farm.level - freePlot; i++){
      let currentBerry = farm.plantations[i];
      val += `Champ ${i+1} : ${currentBerry.emoji} : <t:${parseInt(currentBerry.date+currentBerry.timeToGrow)}:R>`
    }
    for (let i = 1; i <= freePlot; i++) {
      val += `Champ ${farm.level - freePlot + i} : :green_square:\n`
    }
    const embed = new MessageEmbed()
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() })
      .addFields({name: `Level de la ferme : ${player.farm.level}`, value: val})
    interaction.reply({embeds: [embed] });
  }
}