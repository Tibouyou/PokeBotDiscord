const { MessageEmbed } = require('discord.js');
const { Player, Pokemon } = require('../../models/listmodel');
const { MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('pagedown-button')
      .setLabel('⬅')
      .setStyle('SECONDARY'),
      
    new MessageButton()
      .setCustomId('pageup-button')
      .setLabel('➡')
      .setStyle('SECONDARY'),
  )  

async function embedPokedex(client, player, sumPoke, numberOfPages, currentPage, user) {
  let listPokemon = [];
  const mini = currentPage * 10 - 9;
  const maxi = (currentPage == numberOfPages) ? mini + sumPoke % 10 - 1: currentPage * 10 + 1;
  for (let i = mini; i <= maxi; i++) {
    if (player.pokemon.map(p => p.number).includes(i)) {
      let pokemon;
      if (!player.pokemon.filter(pokemon => pokemon.number == i).filter(pokemon => pokemon.isShiny).length == 0) {
        pokemon = player.pokemon.filter(pokemon => pokemon.isShiny).filter(pokemon => pokemon.number == i)[0];
      } else {
        pokemon = await Pokemon.findOne({ number: i});
      }
      listPokemon.push(pokemon);
    } else {
      const pokemon = await Pokemon.findOne({ number: 0});
      listPokemon.push(pokemon);
    }
  }
  const embed = new MessageEmbed()
      .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
      .setColor('#cf102a')
      .setThumbnail('https://media.discordapp.net/attachments/998631528563232798/999034290186748105/pokedex.png')
      .setTimestamp()
      .setFooter({ text: `page ${currentPage}/${numberOfPages}` , iconURL: client.user.displayAvatarURL() })
      .setDescription(`${listPokemon.map(p => `${(p.isShiny) ? `${p.emoji} ${p.name} | ${p.emojiShiny} :sparkles:` : `${p.emoji} ${p.name}`}`).join('\n ')}`)   
  return embed;
}  

module.exports = {
  name: 'pokedex',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'page',
      description: 'La page du pokédex à consulter',
      type: 'NUMBER',
      required: false,
    },
  ],  
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const user = interaction.user;
    const sumPoke = await Pokemon.estimatedDocumentCount() - 1;
    const numberOfPages = Math.trunc(sumPoke / 10) + 1;
    let currentPage;
    if (interaction.options.getNumber('page')) {
      if (interaction.options.getNumber('page') > numberOfPages) return interaction.reply('La page est trop grande');
      if (interaction.options.getNumber('page') <= 0) return interaction.reply('La page est trop petite');
      currentPage = interaction.options.getNumber('page')
    } else {
      currentPage = 1;
    }
    interaction.reply({embeds: [await embedPokedex(client, player, sumPoke, numberOfPages, currentPage, user)], components: [buttons] });
    const message = await interaction.fetchReply();
    const collector = message.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.customId === 'pageup-button') {
        if (currentPage + 1 == numberOfPages + 1) return;
        currentPage += 1;
      } else {
        if (currentPage - 1 == 0) return;
        currentPage -= 1;
      }
      i.update({embeds: [await embedPokedex(client, player, sumPoke, numberOfPages, currentPage, user)], components: [buttons] });
    });
  }
}