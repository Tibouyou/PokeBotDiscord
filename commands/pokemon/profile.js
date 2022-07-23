const { MessageEmbed } = require('discord.js');
const { Player, Pokemon } = require('../../models/listmodel');

module.exports = {
  name: 'profile',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const sumPoke = await Pokemon.estimatedDocumentCount() - 1;
    const player = await Player.findOne({ id: interaction.user.id });
    let pc = 0;
    player.pokemon.forEach(x => pc += x.pc);
    const embed = new MessageEmbed()
    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .addFields(
      { name: '<:pokepiece:998163328247529542> Poképiece', value: `${player.money}`, inline: true },
      { name: '<:pokedex:998163325164716063> Pokédex', value: `${player.pokedex}/${sumPoke}`, inline: true },
      { name: '<:mamre:677223686763315250> Puissance de Combat', value: `${pc}`, inline: true }
    )
    .addFields(
      { name: '<:pokeBall:998163291543195709> Pokéball', value: `<:pokeBall:998163291543195709> ${player.inventory.pokeball} <:superBall:998163292654665768> ${player.inventory.superball} <:hyperBall:998163289114681374> ${player.inventory.hyperball} <:masterBall:998163290293284945> ${player.inventory.masterball}`, inline: true },
      { name: '<:ceriz:998163243895894087> Baies', value: `<:ceriz:998163243895894087> ${player.inventory.ceriz}`, inline: true}
    )
    .setTimestamp()
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });
  
    interaction.reply({embeds: [embed] });
  }
}