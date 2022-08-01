const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const mongoose = require('mongoose');
const client = new Client({ intents: 1539, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
const Logger = require('./utils/Logger');
const schedule = require('node-schedule');
const { Cooldown } = require('./models/listmodel');

async function reset(command) {
  let cd = await Cooldown.findOne({name:command});
  console.log(cd);
  console.log(cd.users);
  cd.users = [];
  console.log(cd.users);
  cd.save();
}


['commands', 'buttons', 'selects'].forEach(x => client[x] = new Collection());


['CommandUtil', 'EventUtil', 'ButtonUtil', 'SelectUtil'].forEach(handler => {require(`./utils/handlers/${handler}`)(client)});


process.on('exit', code => { Logger.client(`Le processus s'est arrêté avec le code: ${code}!`) });

process.on('uncaughtException', (err, origin) => {
  Logger.error(`UNCAUGHT_EXCEPTION: ${err}`);
  console.error(`Origine: ${origin}`) 
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.warn(`UNHANDLED_REJECTION: ${reason}`);
  console.log(promise);
});

//process.on('warning', (...args) => Logger.warn(...args));

const rule1 = new schedule.RecurrenceRule();
rule1.hour = [0,2,4,6,8,10,12,14,16,18,20,22];
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
rule.minute = 0;
schedule.scheduleJob(rule3, function(){
  reset("daily");
});

mongoose.connect(process.env.DATABASE_URI, {
  autoIndex: false, 
  maxPoolSize: 10, 
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000, 
  family: 4 
}).then(() => { Logger.client('- connecté à la base de données'); })
.catch(err => { Logger.error(err); });

client.login(process.env.DISCORD_TOKEN);