const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Player } = require('../../models/listmodel');

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

let nbLife;
let maxLife;
let nbCoffre;
let maxCoffre;

const zoneMoney = {
  1 : 50,
  2 : 75,
  3 : 100,
  4 : 125,
  5 : 162.5,
  6 : 200,
  7 : 250,
  8 : 312.5,
  9 : 375,
  10 : 437.5,
  11 : 500
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


async function moove(interaction, pos, client, player, explored) {
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
  let currentCase = '';
  switch (donjon[pos[0]][pos[1]]) {
    case "<:dracaufeu:998691505734692976>":
      nbLife -= 1;
      if (nbLife <= 0) {
        currentCase = "Oh non ! Vous êtes tombé sur un pokémon adverse !\nVous n'avez plus de vie, vous devez rentrer chez vous soigner vos pokémons !"
      } else {
        currentCase = 'Oh non ! Vous êtes tombé sur un pokémon adverse !';
      }
      break;
    case "🏆":
      nbCoffre += 1
      if (nbCoffre >= maxCoffre) {
        const amount = getRandomIntInclusive(zoneMoney[player.maxZone]*0.9,zoneMoney[player.maxZone]*1.1);
        player.money += amount;
        player.save();
        currentCase = `Bravo, vous avez trouvé un coffre qui contenait ${amount} <:pokepiece:998163328247529542>!\nIl n\'y a plus aucun coffre à trouver ici, vous pouvez rentrer chez vous`;
      } else {
        const amount = getRandomIntInclusive(zoneMoney[player.maxZone]*0.9,zoneMoney[player.maxZone]*1.1);
        player.money += amount;
        player.save();
        currentCase = `Bravo, vous avez trouvé un coffre qui contenait ${amount} <:pokepiece:998163328247529542>!`;
      }
      
      break; 
    case "🟩":
      currentCase = "Vous n'avez rien rencontré de spécial sur cette case";
      break;   
  }

  const embed = new MessageEmbed()
    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp()
    .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() })
    .setDescription(desc+`${'❤'.repeat(nbLife)}${'🖤'.repeat(maxLife-nbLife)}\n${currentCase}\n${moovable? '' : 'Vous ne pouvez pas vous déplacer sur cette case'}`)
    .setColor('#cf102a')
  if (nbLife <= 0) return interaction.update({embeds: [embed], components: [] }); 
  if (nbCoffre >= maxCoffre) return interaction.update({embeds: [embed], components: [] });
  interaction.update({embeds: [embed], components: [buttons] });
  const filter = i => i.user.id === interaction.user.id;
  await message.awaitMessageComponent({filter, time: 30000 })
    .then(async interaction => { 
      moove(interaction, pos, client, player, explored);
    })
}

module.exports = {
  name: 'donjon',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    size = getRandomIntInclusive(3,8);
    let nbChest = getRandomIntInclusive(Math.round(size/2),size);
    let nbRencontre = getRandomIntInclusive(Math.round(size/2),size);
    nbLife = Math.round(nbRencontre * 2 / 3);
    maxLife = Math.round(nbRencontre * 2 / 3);
    nbCoffre = 0;
    maxCoffre = nbChest;
    let explored;
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
    let pos = [0,0];
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
      .setDescription(desc+`${'❤'.repeat(nbLife)}\nVous n'avez rien rencontré de spécial sur cette case`)
      .setColor('#cf102a')
    interaction.reply({embeds: [embed], components: [buttons] });
    const message = await interaction.fetchReply();
    const filter = i => i.user.id === interaction.user.id;
    await message.awaitMessageComponent({filter, time: 30000 })
     .then(async interaction => {
      moove(interaction, pos, client, player, explored);
     })
  }
}