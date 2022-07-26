const Logger = require('../../utils/Logger');
const schedule = require('node-schedule');
const { Cooldown } = require('../../models/listmodel');

async function reset(command) {
  let cd = await Cooldown.findOne({name:command});
  cd.users = [];
  cd.save();
}



module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    let guildsCount = await client.guilds.fetch();
    let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

    Logger.client(`- prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs`);

    client.user.setPresence({ activities: [{ name: '/help', type: 'PLAYING' }], status: 'online' });

    //dev sur un serv
    //const devGuild = await client.guilds.cache.get('725671112658255892');
    //devGuild.commands.set(client.commands.map(cmd => cmd));
    //dev actuel
    client.guilds.cache.forEach(g => g.commands.set(client.commands.map(cmd => cmd)));
    //terminé
    //client.application.commands.set(client.commands.map(cmd => cmd))

    const rule1 = new schedule.RecurrenceRule();
    rule1.hour = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    rule1.minute = 0;

    schedule.scheduleJob(rule1, function(){
      reset("donjon");
    });

    const rule2 = new schedule.RecurrenceRule();
    rule2.minute = [0,30];
    schedule.scheduleJob(rule2, function(){
     reset("rollpokemon");
    });

    const rule3 = new schedule.RecurrenceRule();
    rule3.hour = [0];
    rule3.minute = 0;
    schedule.scheduleJob(rule3, function(){
      reset("daily");
    });
  },
};