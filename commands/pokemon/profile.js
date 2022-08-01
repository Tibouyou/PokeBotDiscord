const { MessageEmbed } = require('discord.js');
const { Player, Pokemon } = require('../../models/listmodel');

function formatNumber(number){
  if (number > 1000000000) return `${(number/1000000000).toFixed(2)}B`
  if (number > 1000000) return `${(number/1000000).toFixed(2)}M`
  if (number > 1000) return `${(number/1000).toFixed(2)}K`
  return number;
}

const ball = ["pokeball", "superball", "hyperball", "masterball"];
const berry = ["ceriz", "maron", "pecha", "fraive", "willia", "mepo", "oran", "kika", "prine", "sitrus"];
const emoji = {'pokeball':'<:pokeBall:998163291543195709>', 'superball':'<:superBall:998163292654665768>', 'hyperball':'<:hyperBall:998163289114681374>', 'masterball':'<:masterBall:998163290293284945>', 'ceriz':'<:ceriz:998163243895894087>', "maron":"<:maron:998163247435890768>", "pecha":"<:pecha:998163250854248510>", "fraive":"<:fraive:998163244986404954>", "willia":"<:willia:998163254914326599>", "mepo":"<:mepo:998163248589328415>", "oran":"<:oran:998163249671450694>", "kika":"<:kika:998163246307622982>", "prine":"<:prine:998163252355797102>", "sitrus":"<:sitrus:998163253656031315>"};

module.exports = {
  name: 'profile',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const sumPoke = await Pokemon.estimatedDocumentCount() - 1;
    const player = await Player.findOne({ id: interaction.user.id });
    const pokeballString = ball.map(x => {
      if (player.inventory[x] > 0) return `${emoji[x]} ${player.inventory[x]}`;   
      }).join(' ') + 'ㅤ';
    const berryString = berry.map(x => {
      if (player.inventory[x] > 0) return `${emoji[x]} ${player.inventory[x]}`;   
      }).join(' ') + 'ㅤ';
    let pc = 0;
    player.pokemon.forEach(x => pc += x.pc);
    const embed = new MessageEmbed()
    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .addFields(
      { name: '<:pokepiece:998163328247529542> Poképiece', value: `${player.money}`, inline: true },
      { name: '<:pokedex:998163325164716063> Pokédex', value: `${player.pokedex}/${sumPoke}`, inline: true },
      { name: '<:mamre:677223686763315250> Puissance de Combat', value: `${formatNumber(pc)}`, inline: true }
    )
    .addFields(
      { name: '<:pokeBall:998163291543195709> Pokéball', value: pokeballString, inline: true },
      { name: '<:ceriz:998163243895894087> Baies', value: berryString, inline: true}
    )
    .setTimestamp()
    .setColor('#cf102a')
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });
  
    interaction.reply({embeds: [embed] });
  }
}