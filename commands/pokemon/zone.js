const { Player } = require('../../models/listmodel');
const { MessageActionRow, MessageButton } = require('discord.js');

function formatNumber(number){
  if (number > 1000000000) return `${(number/1000000000).toFixed(2)}B`
  if (number > 1000000) return `${(number/1000000).toFixed(2)}M`
  if (number > 1000) return `${(number/1000).toFixed(2)}K`
  return number;
}

const zoneRequirement = {
  1 : 0,
  2 : 100,
  3 : 600,
  4 : 2800,
  5 : 12000,
  6 : 50000,
  7 : 220000,
  8 : 950000,
  9 : 4000000,
  10 : 15000000,
  11 : 60000000
}

const buttons = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('confirm')
      .setLabel('OUI')
      .setStyle('SUCCESS'),
      
    new MessageButton()
      .setCustomId('refuse')
      .setLabel('NON')
      .setStyle('DANGER'),
  ) 

module.exports = {
  name: 'zone',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'number',
      description: 'Choisir le numéro de la zone où se déplacer',
      type: 'NUMBER',
      required: false,
    },
  ],
  async runInteraction(client, interaction) {
    let player = await Player.findOne({ id: interaction.user.id });
    const number = interaction.options.getNumber('number');
    if(!number) {
      let desc = '';
      for (let i = 1; i <= 11; i++) {
        desc += `Zone ${i} : ${formatNumber(zoneRequirement[i])} \n`;
      }
      return interaction.reply(`Vous êtes actuellement zone : ${player.currentZone}\n\n${desc}`);
    }  
    if (number <= player.maxZone) {
      player.currentZone = number;
      interaction.reply(`Vous capturez maintenant des pokémons de la zone ${number} et moins`)
    } else {
      let pc = 0;
      player.pokemon.forEach(x => pc += x.pc);
      if (pc >= zoneRequirement[number]) {
        interaction.reply(`Vous pouvez maintenant capturer des pokémons de la zone ${number} et moins`);
        player.currentZone = number;
        player.maxZone = number;
      } else {
        interaction.reply(`Il vous faut \`${formatNumber(zoneRequirement[number])}\` pc pour aller dans cette zone\n(Il vous manque \`${formatNumber(zoneRequirement[number]-pc)}\` pc)`);
      }
    }
    player.save();
  }
}