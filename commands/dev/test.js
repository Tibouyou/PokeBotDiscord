const { Player } = require('../../models/listmodel');

function formatNumber(number){
  if (number > 1000000000) return `${(number/1000000000).toFixed(1)}B`
  if (number > 1000000) return `${(number/1000000).toFixed(1)}M`
  if (number > 1000) return `${(number/1000).toFixed(1)}K`
}

const ball = ["pokeball", "superball", "hyperball", "masterball"];
const berry = ["ceriz"];
const emoji = {"pokeball": "<:pokeBall:998163291543195709>", "superball": "<:superBall:998163292654665768>", "hyperball": "<:hyperBall:998163289114681374>", "masterball": "<:masterBall:998163290293284945>", "ceriz": "<:ceriz:998163243895894087>"};

module.exports = {
  name: 'test',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const player = await Player.findOne({ id: interaction.user.id });
    const pokeballString = ball.map(x => `${emoji[x]} ${player.inventory[x]}`).join(' ');
    interaction.reply(pokeballString);
  }
}