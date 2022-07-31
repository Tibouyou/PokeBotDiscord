const { Player } = require('../../models/listmodel');


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const zoneMoney = {
  1 : 200,
  2 : 300,
  3 : 400,
  4 : 500,
  5 : 650,
  6 : 800,
  7 : 1000,
  8 : 1250,
  9 : 1500,
  10 : 1750,
  11 : 2000
}

module.exports = {
  name: 'daily',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const amount = getRandomIntInclusive(zoneMoney[player.maxZone]*0.9,zoneMoney[player.maxZone]*1.1);
    //player.money += amount;
    //player.save();
    console.log(amount);
    //interaction.reply(`${amount} pokécoins ajoutés à ${target} !`);
  }
}