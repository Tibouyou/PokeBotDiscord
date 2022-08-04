const { MessageEmbed } = require('discord.js');
const { Player, Pokemon } = require('../../models/listmodel');

function getPC(player) {
  let pc = 0;
  player.pokemon.forEach(x => pc += x.pc);
  return pc;
}

function formatNumber(number){
  if (number > 1000000000) return `${(number/1000000000).toFixed(2)}B`
  if (number > 1000000) return `${(number/1000000).toFixed(2)}M`
  if (number > 1000) return `${(number/1000).toFixed(2)}K`
  return number;
}

function getClassement(classement) {
  // Create items array
  var items = Object.keys(classement).map(function(key) {
    return [key, classement[key]];
  });
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  return items.splice(0,10);
}

module.exports = {
  name: 'leaderboard',
  ownerOnly: false,
  description: 'placeholder',
  options: [
    {
      name: 'leaderboard',
      description: 'Choisir le type de classement',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'pc',
          value: 'pc'
        },
        {
          name: 'money',
          value: 'money'
        },
        {
          name: 'zone',
          value: 'zone'
        },
        {
          name: 'pokemon',
          value: 'pokemon'
        },
        {
          name: 'farm',
          value: 'farm'
        }
      ]
    }
  ],  
  async runInteraction(client, interaction) {
    const playerList = await Player.find({});
    let desc = '';
    let title;
    let classement = {};
    switch (interaction.options.getString('leaderboard')) {
      case 'pc':
        playerList.forEach(player => {
          if (client.users.cache.find(user => user.id === player.id)) classement[client.users.cache.find(user => user.id === player.id).username] = getPC(player);
        })
        desc = `${`${getClassement(classement).join(' PC\n')} PC`.replaceAll(',',' : ')}`;
        title = 'PC Leaderboard';
        break;
      case 'money':
        playerList.forEach(player => {
          if (client.users.cache.find(user => user.id === player.id)) classement[client.users.cache.find(user => user.id === player.id).username] = player.money;
        })
        desc = `${`${getClassement(classement).join(' <:pokepiece:998163328247529542>\n')}  <:pokepiece:998163328247529542>`.replaceAll(',',' : ')}`;
        title = 'Poképièces Leaderboard';
        break;
      case 'zone':
        playerList.forEach(player => {
          if (client.users.cache.find(user => user.id === player.id)) classement[client.users.cache.find(user => user.id === player.id).username] = player.maxZone;
        })
        desc = `${`${getClassement(classement).join('\n')}`.replaceAll(',',' : Zone ')}`;
        title = 'Zone Leaderboard';
        break;
      case 'pokemon':
        playerList.forEach(player => {
          if (client.users.cache.find(user => user.id === player.id)) {
            let bestPoke = player.pokemon[0];
            player.pokemon.forEach(pokemon => {
              if (pokemon.pc >= bestPoke.pc) bestPoke = pokemon;
            })
            classement[client.users.cache.find(user => user.id === player.id).username] = `${bestPoke.name} (${formatNumber(bestPoke.pc)} PC)`;
          } 
        })
        desc = `${`${getClassement(classement).join('\n')}`.replaceAll(',',' : ')}`;
        title = 'Best Pokemon Leaderboard';
        break; 
      case 'farm':
        playerList.forEach(player => {
          if (client.users.cache.find(user => user.id === player.id)) classement[client.users.cache.find(user => user.id === player.id).username] = player.farm.level;
        })
        desc = `${`${getClassement(classement).join('\n')}`.replaceAll(',',' : Level ')}`;
        title = 'Farm Leaderboard';
        break;       
    }
    
    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor('#cf102a')
      .setTimestamp()
      .setDescription(desc)   
    return interaction.reply({embeds: [embed]});
  }
}