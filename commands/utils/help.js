const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const commandFolder = readdirSync('./commands');

const contextDescription = {
  userinfo: 'Renvoie des informations sur l\'utilisateur'
}

module.exports = {
  name: 'help',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    return interaction.reply(':warning: WORK IN PROGRESS !!! :warning:');
  }
}