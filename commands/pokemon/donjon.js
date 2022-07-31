const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Player } = require('../../models/listmodel');

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('left')
        .setStyle('SECONDARY')
        .setEmoji('⬅'),
        
      new MessageButton()
        .setCustomId('right')
        .setStyle('SECONDARY')
        .setEmoji('➡'),
        
      new MessageButton()
        .setCustomId('up')
        .setStyle('SECONDARY')
        .setEmoji('⬆'),
      
      new MessageButton()
        .setCustomId('down')
        .setStyle('SECONDARY')
        .setEmoji('⬇'),
    )

let donjon;
let size;


async function moove(interaction, pos, client, player, pc, explored) {
  let moovable = true;
  const message = await interaction.message;
  switch (interaction.customId) {
    case 'up':
      if (pos[0] - 1 < 0) {
        moovable = false;
      } else {
        pos[0] -= 1;
      }
      break;
    case 'down':
      if (pos[0] + 1 > size-1) {
        moovable = false;
      } else {
        pos[0] += 1;
      }
      break; 
    case 'left':
      if (pos[1] - 1 < 0) {
        moovable = false;
      } else {
        pos[1] -= 1;
      }
      break;   
    case 'right':
      if (pos[1] + 1 > size-1) {
        moovable = false;
      } else {
        pos[1] += 1;
      }
      break;  
  }
  explored[pos[0]][pos[1]] = true;
  desc = "";
  for(let i = 0; i < size; i++) {
    for(let j=0; j < size; j++) {
      if (!explored[i][j]) {
        desc += "⬛";
      } else {
        if (i == pos[0] && j == pos[1]) {
          desc += ":polar_bear:";
        } else {
          desc += donjon[i][j];
        }
      }
    }
    desc += '\n';
  }
  const embed = new MessageEmbed()
    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp()
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() })
    .setDescription(desc+`\nVous êtes sur une case : ${donjon[pos[0]][pos[1]]}\n${moovable? '' : 'Vous ne pouvez pas vous déplacer sur cette case'}`)
  interaction.update({embeds: [embed], components: [buttons] });
  const filter = i => i.user.id === interaction.user.id;
  await message.awaitMessageComponent({filter, time: 30000 })
    .then(async interaction => { 
      moove(interaction, pos, client, player, pc, explored);
    })
    .catch(err => console.log("Temps écoulé"));
}

module.exports = {
  name: 'donjon',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    size = getRandomIntInclusive(3,8);
    let nbChest = getRandomIntInclusive(Math.round(size/2),size);
    let nbRencontre = getRandomIntInclusive(Math.round(size/2),size);
    let explored;
    let compteur = 0;
    donjon = Array.from({length: size}, () => Array.from({length: size}));
    explored = Array.from({length: size}, () => Array.from({length: size}));
    donjon[0][0] = "🟩";
    do {
      ligne = getRandomIntInclusive(0,size-1);
      colonne = getRandomIntInclusive(0,size-1);
      if (donjon[ligne][colonne] === undefined) {
        donjon[ligne][colonne] = "<:dracaufeu:998691505734692976>";
        nbRencontre -= 1;
      }
    } while (nbRencontre > 0);
    do {
      ligne = getRandomIntInclusive(0,size-1);
      colonne = getRandomIntInclusive(0,size-1);
      if (donjon[ligne][colonne] === undefined) {
        donjon[ligne][colonne] = "🏆";
        nbChest -= 1;
      }
    } while (nbChest > 0);
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if (!donjon[i][j]) donjon[i][j] = "🟩";
        explored[i][j] = false;
      }  
    }
    const player = await Player.findOne({ id: interaction.user.id }); 
    let pc = 0;
    player.pokemon.forEach(x => pc += x.pc);
    let pos = [2,3];
    explored[pos[0]][pos[1]] = true;
    desc = "";
    for(let i = 0; i < size; i++) {
      for(let j=0; j < size; j++) {
        if (!explored[i][j]) {
          desc += "⬛";
        } else {
          if (i == pos[0] && j == pos[1]) {
            desc += ":polar_bear:";
          } else {
            desc += donjon[i][j];
          }
        }
      }
      desc += '\n';
    }
    const embed = new MessageEmbed()
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() })
      .setDescription(desc+`\nVous n'avez rien rencontré de spécial sur cette case`)
    interaction.reply({embeds: [embed], components: [buttons] });
    const message = await interaction.fetchReply();
    const filter = i => i.user.id === interaction.user.id;
    await message.awaitMessageComponent({filter, time: 30000 })
     .then(async interaction => {
      moove(interaction, pos, client, player, pc, explored);
     })
     .catch(err => console.log("Temps écoulé"));
  }
}