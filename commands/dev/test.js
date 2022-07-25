const schedule = require('node-schedule');

module.exports = {
  name: 'test',
  ownerOnly: true,
  description: 'placeholder',
  async runInteraction(client, interaction) {
    const rule = new schedule.RecurrenceRule();
    rule.minute = [0,2,4,6,8,9,10,11,12,14,16];

    const job = schedule.scheduleJob(rule, function(){
    console.log('Today is recognized by Rebecca Black!');
    });
  }
}