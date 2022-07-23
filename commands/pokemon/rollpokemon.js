const { Pokemon, Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');


  
async function tryCatchPokemon(interaction, player, pokemonToPush) {
  const message = await interaction.message;
  let captureChance;
  let enoughBall = true;
  if ((player.inventory[interaction.customId] - 1) < 0) {
    enoughBall = false;
  } else {
    player.inventory[interaction.customId] -= 1;
    player.markModified('pokeball')
    if (interaction.customId == 'pokeball') {
      captureChance = 0.3;
    } else if (interaction.customId == 'superball') {
      captureChance = 0.5;
    } else if (interaction.customId == 'hyperball') {
      captureChance = 0.75;
    } else if (interaction.customId == 'masterball') {
      captureChance = 0.99;
    }
  }  
  if (Math.random() < captureChance) {
    const file = new MessageAttachment(`./assets/pokemon/${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`);
    const embed = new MessageEmbed()
      .setDescription(`Bravo, vous avez capturé un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}**` : `${pokemonToPush.name} *Shiny*** `}`)
      .setThumbnail(`attachment://${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`)
    interaction.update({embeds: [embed], files: [file], components: []});
    if (!player.pokemon.map(p => p.number).includes(pokemonToPush.number)) player.pokedex += 1;
      player.pokemon.push(pokemonToPush);
      player.save(); 
    } else {
      player.save(); 
    const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('pokeball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.pokeball}`)
        .setEmoji('<:pokeBall:998163291543195709>'),
        
      new MessageButton()
        .setCustomId('superball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.superball}`)
        .setEmoji('<:superBall:998163292654665768>'),
        
      new MessageButton()
        .setCustomId('hyperball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.hyperball}`)
        .setEmoji('<:hyperBall:998163289114681374>'),
      
      new MessageButton()
        .setCustomId('masterball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.masterball}`)
        .setEmoji('<:masterBall:998163290293284945>'),    
    )
    const file = new MessageAttachment(`./assets/pokemon/${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`);
    const embed = new MessageEmbed()
      .setDescription(`Vous venez de rencontrer un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}**` : `${pokemonToPush.name}**\n \nCes couleurs semblent inhabituelles...`}\n\n Le pokémon fuira dans <t:${parseInt(Date.now()/1000+30)}:R>\n\n ${enoughBall? `Vous avez raté votre ${interaction.customId == 'masterball' ? 'masterball, elle était probable défectueuse' : interaction.customId} !` : `Vous n'avez pas assez de ${interaction.customId}`}`)
      .setThumbnail(`attachment://${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`)
  interaction.update({embeds: [embed], files: [file], components: [buttons]});   
  const filter = i => i.user.id === interaction.user.id;
  await message.awaitMessageComponent({filter, time: 30000 })
    .then(async interaction => { 
      tryCatchPokemon(interaction, player, pokemonToPush);
    })
    .catch(err => {
      const lastEmbed = new MessageEmbed()
      .setDescription(`Le pokémon a fuit...`)
      .setThumbnail(`https://cdn.discordapp.com/attachments/998631528563232798/999762522812993647/pikachu-running.gif`)
      message.edit({embeds: [lastEmbed], files: [], components: []});  
    });
  }
}  

module.exports = {
  name: 'rollpokemon',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('pokeball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.pokeball}`)
        .setEmoji('<:pokeBall:998163291543195709>'),
        
      new MessageButton()
        .setCustomId('superball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.superball}`)
        .setEmoji('<:superBall:998163292654665768>'),
        
      new MessageButton()
        .setCustomId('hyperball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.hyperball}`)
        .setEmoji('<:hyperBall:998163289114681374>'),
      
      new MessageButton()
        .setCustomId('masterball')
        .setStyle('SECONDARY')
        .setLabel(`x${player.inventory.masterball}`)
        .setEmoji('<:masterBall:998163290293284945>'),    
    )
    const min = Math.ceil(1);
    const max = await Pokemon.estimatedDocumentCount() - 1;
    const pokemonNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const pokemon = await Pokemon.findOne({ number: pokemonNumber});
    const pokemonToPush = await new Pokemon({
      number: pokemon.number, 
      name: pokemon.name, 
      emoji: pokemon.emoji,
      emojiShiny: pokemon.emojiShiny, 
      isShiny: (Math.random() <= 0.25) ? true : false
    })  
    const file = new MessageAttachment(`./assets/pokemon/${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`);
    const embed = new MessageEmbed()
      .setDescription(`Vous venez de rencontrer un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}**` : `${pokemonToPush.name}**\n \nCes couleurs semblent inhabituelles...`} \n\n Le pokémon fuira <t:${parseInt(Date.now()/1000+30)}:R>`)
      .setThumbnail(`attachment://${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`)
    interaction.reply({embeds: [embed], files: [file], components: [buttons]});  
    const message = await interaction.fetchReply();
    const filter = i => i.user.id === interaction.user.id;
    await message.awaitMessageComponent({filter, time: 30000 })
     .then(async interaction => {
      tryCatchPokemon(interaction, player, pokemonToPush);
     })
     .catch(err => {
      const lastEmbed = new MessageEmbed()
       .setDescription(`Le pokémon a fuit...`)
       .setThumbnail(`https://cdn.discordapp.com/attachments/998631528563232798/999762522812993647/pikachu-running.gif`)
      message.edit({embeds: [lastEmbed], files: [], components: []});  
     }); 
  }
}