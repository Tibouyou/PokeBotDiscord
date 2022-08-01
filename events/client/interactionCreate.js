const ownerId = '242685182900043786';
const { Player, Cooldown } = require('../../models/listmodel');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(client, interaction) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      if (!(interaction.commandName == 'play')) {
        const player = await Player.findOne({ id : interaction.user.id });
        if (!player) return interaction.reply('Merci de taper la comande \`/play\` avant de commencer à jouer !')
      }
      if (interaction.commandName == 'play') {
        const player = await Player.findOne({ id : interaction.user.id });
        if (player) return interaction.reply('Vous avez déjà utilisé la commande \`/play\` !')
      }
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.reply("Cette commande n'existe pas!");

      if(cmd.ownerOnly) {
        if (interaction.user.id != ownerId) return interaction.reply('La seule personne pouvant taper cette commande est le développeur du bot');
      }

      if(interaction.commandName == "donjon") {
        let cdMap = await Cooldown.findOne({name:"donjon"});
        if (cdMap.users.includes(interaction.user.id)) {
          return interaction.reply('Vous devez attendre avant de pouvoir refaire cette commande');
        } else {
          cdMap.users.push(interaction.user.id)
        }
        cdMap.save();
      }

      if(interaction.commandName == "rollpokemon") {
        let cdMap = await Cooldown.findOne({name:"rollpokemon"});
        if (cdMap.users.includes(interaction.user.id)) {
          return interaction.reply('Vous devez attendre avant de pouvoir refaire cette commande');
        } else {
          cdMap.users.push(interaction.user.id)
        }
        cdMap.save();
      }

      if(interaction.commandName == "daily") {
        let cdMap = await Cooldown.findOne({name:"daily"});
        if (cdMap.users.includes(interaction.user.id)) {
          return interaction.reply('Vous devez attendre avant de pouvoir refaire cette commande');
        } else {
          cdMap.users.push(interaction.user.id)
        }
        cdMap.save();
      }

      cmd.runInteraction(client, interaction);
    } else if (interaction.isButton()) {
      const btn = client.buttons.get(interaction.customId);
      if (!btn) return //interaction.reply("Ce bouton n'existe pas!");
      btn.runInteraction(client, interaction);
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selects.get(interaction.customId);
      if (!selectMenu) return interaction.reply("Ce menu n'existe pas!");
      selectMenu.runInteraction(client, interaction);
    }
  },
};