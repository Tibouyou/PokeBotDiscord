const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  ownerOnly: false,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const embed = new MessageEmbed()
      .addFields(
        {name: 'Comment Jouer ?', value: "`/profile` pour afficher votre profile\n`/shop` pour voir les prix des pokéballs et des baies\n`/buy` [nom de l'objet] [montant] pour acheter des pokéballs ou des baies\n`/rollpokemon` (cooldown de 30 minutes) pour rencontrer un pokémon aléatoire"},
        {name: 'Gagner de l\'argent', value: "`/farm` pour afficher votre ferme\n`/plant` [nom de la baie] <nombre de baie> pour planter une ou plusieurs baie dans votre ferme\n`/harvest` [nom de la baie] pour récolter vos baies\n`/upgrade` [farm] pour améliorer votre ferme\n\n`/donjon` (cooldown de 2 heures) pour explorer un donjon et tenter de trouver des coffres\n`/daily` (1x par jour) pour récupérer votre bonus quotidien"},
        {name: 'Compléter son pokédex', value: "`/pokedex` pour afficher votre pokédex\n`/zone` <numéro de la zone> pour voir votre zone actuelle ou pour changer de zone\n`/pokemon` pour voir vos pokémons\n`/upgrade` [encens] pour améliorer son encens et augmenter ses chances de capturer des pokémon de la zone choisie\n\n<> = option | [] = obligatoire"}

      )
      .setColor('#cf102a')
      .setTimestamp()
      .setFooter({ text: client.user.username , iconURL: client.user.displayAvatarURL() });
    return interaction.reply({embeds: [embed]});
  }
}