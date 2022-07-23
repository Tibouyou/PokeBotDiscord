const { MessageEmbed } = require('discord.js');
const { Player, Pokemon } = require('../../models/listmodel');


module.exports = {
  name: 'pokemon',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    let player = await Player.findOne({ id: interaction.user.id });
    const embed = new MessageEmbed()
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() })
      .setDescription(`${player.pokemon.map(p => `${(p.isShiny) ? `${p.emojiShiny} ${p.name} :sparkles:` : `${p.emoji} ${p.name}`}`).join('\n ')}`)
    interaction.reply({embeds: [embed] });
  }
}