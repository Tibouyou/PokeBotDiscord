const { Pokemon, Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');

function formatNumber(number){
  if (number > 1000000000) return `${(number/1000000000).toFixed(2)}B`
  if (number > 1000000) return `${(number/1000000).toFixed(2)}M`
  if (number > 1000) return `${(number/1000).toFixed(2)}K`
  return number;
}

const capture = { "pokeball" : 0.3, "superball" : 0.5, "hyperball" : 0.75, "masterball" : 10 };

const listePC = {
  1 : [2,4],
  2 : [8,16],
  3 : [32,64],
  4 : [128,256],
  5 : [512,1024],
  6 : [2048,4096],
  7 : [8192,16384],
  8 : [32768,65536],
  9 : [131072,262144],
  10 : [524288,1000000],
  11 : [1250000,2500000]
}


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

  
async function tryCatchPokemon(interaction, player, pokemonToPush) {
  const message = await interaction.message;
  let captureChance;
  let enoughBall = true;
  if ((player.inventory[interaction.customId] - 1) < 0) {
    enoughBall = false;
  } else {
    player.inventory[interaction.customId] -= 1;
    player.markModified('pokeball')
    if (pokemonToPush.zone > 9) {
      captureChance = capture[interaction.customId] - capture[interaction.customId]/2;
    } else {
      captureChance = capture[interaction.customId] - capture[interaction.customId]/(11-pokemonToPush.zone);
    }
  }
  if (Math.random() < captureChance) {
    const file = new MessageAttachment(`./assets/pokemon/${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`);
    const embed = new MessageEmbed()
      .setDescription(`Bravo, vous avez capturé un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}**` : `${pokemonToPush.name} *Shiny*** `} PC: ${formatNumber(pokemonToPush.pc)}`)
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
      .setDescription(`Vous venez de rencontrer un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}** PC : ${formatNumber(pokemonToPush.pc)}` : `${pokemonToPush.name}** PC : ${formatNumber(pokemonToPush.pc)}\n \nCes couleurs semblent inhabituelles...`}\n\n Le pokémon fuira dans <t:${parseInt(Date.now()/1000+30)}:R>\n\n ${enoughBall? `Vous avez raté votre ${interaction.customId} !` : `Vous n'avez pas assez de ${interaction.customId}`}`)
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
    const zone = player.currentZone
    const pokemonList = await Pokemon.find({
      $and: [
        {zone: { $gte: 1}},
        {zone: { $lt : zone+1 }}
      ]
    });
    const pokemonNumber = Math.floor(Math.random() * pokemonList.length);
    const pokemon = pokemonList[pokemonNumber];
    const pokemonToPush = await new Pokemon({
      number: pokemon.number, 
      name: pokemon.name, 
      emoji: pokemon.emoji,
      emojiShiny: pokemon.emojiShiny,
      zone: pokemon.zone, 
      isShiny: (Math.random() <= 0.008) ? true : false,
      pc: getRandomIntInclusive(listePC[pokemon.zone][0],listePC[pokemon.zone][1])
    })  
    const file = new MessageAttachment(`./assets/pokemon/${!pokemonToPush.isShiny ? pokemonToPush.number : `${pokemonToPush.number}S`}.png`);
    const embed = new MessageEmbed()
      .setDescription(`Vous venez de rencontrer un **${!pokemonToPush.isShiny ? `${pokemonToPush.name}** PC : ${formatNumber(pokemonToPush.pc)}` : `${pokemonToPush.name} ** PC : ${formatNumber(pokemonToPush.pc)}\n \nCes couleurs semblent inhabituelles...`} \n\n Le pokémon fuira <t:${parseInt(Date.now()/1000+30)}:R>`)
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