
const capture = { "pokeball" : 0.25, "superball" : 0.5, "hyperball" : 1, "masterball" : 10 };

module.exports = {
  name: 'test',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    console.log(Math.random());
  }
}