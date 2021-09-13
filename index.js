  
// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const {prefix} = require('./config.json')
const keepAlive = require('./server.js')
const commandList = require('./commands.js')

// Create a new client instance
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], 
  presence: {
      status: 'online',
      activities: [{
        name: `${prefix}help`,
        type: 'STREAMING',
        url:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`
      }]
     } 
    });


client.once('ready',()=>{
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('messageCreate', async message=>{
  if(message.content[0]==prefix){
    const args = message.content.slice(prefix.length).split(' ')
    console.log(args[0])
    switch(args[0]){

      case 'countdown': case 'cd':

        if (isNaN(args[1]) == false){

          const time = args[1]
          let hours = Math.floor(time/3600)
          let minutes = Math.floor((time/3600-hours)*60)
          let seconds = Math.floor(((time-hours*3600-minutes*60)))
          const exampleEmbed = new MessageEmbed()
          exampleEmbed.setColor("#0099ff")
          exampleEmbed.setAuthor('Countdown', message.author.avatarURL())
          exampleEmbed.setDescription(`Countdown in ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
    
          message.reply({
            embeds: [exampleEmbed]
          });
          console.log(time);
            setTimeout(()=>{
              exampleEmbed.setAuthor(`Countdown Complete`,message.author.avatarURL())
              exampleEmbed.setDescription(`\`Countdown complete (${time} seconds)\``)
              message.reply({
                embeds:[exampleEmbed]
              })
            },time*1000)
        } //cd command end
        break
      
      case `help`: case `h`:

      const helpEmbed = new MessageEmbed()
      helpEmbed.setColor("#0099ff")
      helpEmbed.setAuthor(`Commands`,client.user.avatarURL())
      helpEmbed.setDescription(`Description of Tilt's commands`)
      console.log(Object.keys(commandList).length)
      for (let i = 1;i <= Object.keys(commandList).length;i++){
        helpEmbed.addFields(
          {name:commandList[i]["Command"],value:`${commandList[i]["Description"]}\n${commandList[i]["Example"]}`}
        )
      }

      message.reply(
        {
          embeds: [helpEmbed]
        }
      ) //help end
      break;

      case `abababababababababababad`: case `tangent2circle`:

      message.reply(`ababababababababababd`);
      break
   
    }//switch end
  }
})

keepAlive();
// Login to Discord with your client's token
client.login(process.env.token);