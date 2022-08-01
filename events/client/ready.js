const Logger = require('../../utils/Logger');
const schedule = require('node-schedule');
const { Cooldown } = require('../../models/listmodel');

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

    const rule1 = new schedule.RecurrenceRule();
    rule1.hour = [0,2,4,6,8,10,12,14,16,18,20,22];

    let cdDonjon = await Cooldown.findOne({name:"donjon"});

    schedule.scheduleJob(rule1, function(){
      cdDonjon.users = [];
      cdDonjon.save();
    });

    const rule2 = new schedule.RecurrenceRule();
    rule2.minute = [0,30];

    let cdRoll = await Cooldown.findOne({name:"rollpokemon"});

    schedule.scheduleJob(rule2, function(){
      cdRoll.users = [];
      cdRoll.save();
    });

    const rule3 = new schedule.RecurrenceRule();
    rule2.hour = [0];

    let cdDaily = await Cooldown.findOne({name:"daily"});

    schedule.scheduleJob(rule3, function(){
      cdDaily.users = [];
      cdDaily.save();
    });
  },
};