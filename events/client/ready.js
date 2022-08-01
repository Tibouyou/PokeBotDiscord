const Logger = require('../../utils/Logger');


module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    let guildsCount = await client.guilds.fetch();
    let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

    Logger.client(`- prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs`);

    client.user.setPresence({ activities: [{ name: 'dev', type: 'PLAYING' }], status: 'online' });

    //dev sur un serv
    //const devGuild = await client.guilds.cache.get('725671112658255892');
    //devGuild.commands.set(client.commands.map(cmd => cmd));
    //dev actuel
    client.guilds.cache.forEach(g => g.commands.set(client.commands.map(cmd => cmd)));
    //terminé
    //client.application.commands.set(client.commands.map(cmd => cmd))
  },
};