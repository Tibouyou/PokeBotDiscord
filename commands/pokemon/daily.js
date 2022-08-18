const { Player } = require('../../models/listmodel');


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const zoneMoney = {
  1 : 2000,
  2 : 3000,
  3 : 4000,
  4 : 5000,
  5 : 6500,
  6 : 8000,
  7 : 10000,
  8 : 12500,
  9 : 15000,
  10 : 17500,
  11 : 20000
}

module.exports = {
  name: 'daily',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const amount = getRandomIntInclusive(zoneMoney[player.maxZone]*0.9,zoneMoney[player.maxZone]*1.1);
    player.money += amount;
    player.save();
    interaction.reply(`Vous avez gagné ${amount} <:pokepiece:998163328247529542> !`);
  }
}