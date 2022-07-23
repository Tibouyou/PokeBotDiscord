module.exports = {
  name: 'reload',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    await interaction.reply('Bot relancé avec succès');
    return process.exit();
  }
}