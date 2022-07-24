const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const embed = new MessageEmbed()
      .addFields(
        {name: 'Comment Jouer ?', value: "`/play` pour s'enregistrer dans la base de données du bot\n`/shop` pour voir les prix des pokéballs et des baies\nVous pouvez commencer par acheter une baie <:ceriz:998163243895894087>**Ceriz**\n`/plant` [nom de la baie à planter] pour planter une baie dans votre ferme\nVous pouvez planter la baie <:ceriz:998163243895894087>**Ceriz** que vous avez acheté avec `/plant ceriz`\n`/farm` pour voir votre ferme\n`/harvest` pour récolter vos baies\nLorsque vous aurez assez de <:pokepiece:998163328247529542>**Poképièces**, vous pourrez acheter vos premières <:pokeBall:998163291543195709>**Pokéballs**\n`/rollpokemon` (cooldown de 30 minutes) pour rencontrer un pokémon aléatoire"},
        {name: 'Commandes utiles:', value: "`/profile` pour afficher votre profile\n`/pokedex` pour afficher votre pokédex"}
      )
      .setColor('#cf102a')
      .setTimestamp()
      .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });
    return interaction.reply({embeds: [embed]});
  }
}