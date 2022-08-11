const { Player, Baie } = require('../../models/listmodel');


module.exports = {
  name: 'harvest',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    let harvested = [];
    let numberToSplice = [];
    let amount = 0;
    const now = parseInt(Date.now()/1000);
    for (let i = 0; i < player.farm.plantations.length; i++) {
      if ((player.farm.plantations[i].date + player.farm.plantations[i].timeToGrow) <= now) {
        harvested.push(player.farm.plantations[i].name);
        numberToSplice.push(i);
      }
    }
    for (let i = numberToSplice.length - 1; i >= 0; i-- ) {
      player.farm.plantations.splice(numberToSplice[i], 1);
    }
    if (harvested.length == 0) {
      return interaction.reply("Vous n'avez pas de baies à récolter");
    } else {
      for (berry of harvested) {
        const baie = await Baie.findOne({ name: berry });
        amount += baie.value;
      }
    }
    player.money += (amount * (1+player.farm.engrais / 10));
    player.markModified('farm');
    player.save();
    interaction.reply(`Vous avez gagné ${amount * (1+player.farm.engrais / 10)} poképièce <:pokepiece:998163328247529542> (${amount} +${player.farm.engrais * 10} %)grâce à vos baies !`);
  }
}