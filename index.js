// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { DiscordTogether } = require('discord-together');
const Luxon = require('luxon')
const Database = require("@replit/database")


const {prefix} = require('./config.json')
const keepAlive = require('./server.js')
const commandList = require('./commands.js')
const quoteList = require('./strings/quotes.js')
const eightBall = require('./strings/eight.js')

const database = new Database()


// Create a new client instance
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES], 
  presence: {
      status: 'online',
      activities: [{
        name: `${prefix}help`,
        type: 'STREAMING',
        url:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`
      }]
     } 
    });

client.on("debug", function(info){
   console.log(`debug -> ${info}`);
});


client.once("ready", () => {
  console.log("Ready")
})

client.discordTogether = new DiscordTogether(client)

client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})

client.on('messageCreate', async message=>{
  if(message.content[0]==prefix){
    const args = message.content.slice(prefix.length).split(' ')
    switch(args[0]){

      case 'countdown': case 'cd':

      function isPrefix(arg){         
        if (args.length < 2){
        message.reply(`Type your command properly!`)
        return "false"
        }
        let seconds = 0;
        for (let i = 1;i <= arg.length - 1;i++){
          console.log(i)
          if (arg[i].includes(`d`)){
            let days = arg[i].substring(0,arg[i].length-1)
            seconds += days*(3600*24)
          }
          else if (args[i].includes(`h`)){
            let hours = arg[i].substring(0,arg[i].length-1)
            seconds += hours*(3600)
          }
          else if (arg[i].includes(`m`)){
            let minutes = arg[i].substring(0,arg[i].length-1)
            seconds += minutes*(60)
          }
          else if (arg[i].includes(`s`)){
            let second = arg[i].substring(0,arg[i].length-1)
            seconds += second
          }
          else {
            message.reply("Type your command properly!")
            return "false"
          }}
          return seconds
      }
      let time = isPrefix(args)
      if (isNaN(time) == false){
          
          const date = Date.now()
          let hours = Math.floor(time/3600)
          let minutes = Math.floor((time/3600-hours)*60)
          let seconds = Math.floor(((time-hours*3600-minutes*60)))
          const exampleEmbed = new MessageEmbed()
          exampleEmbed.setColor("#0099ff")
          exampleEmbed.setAuthor('Countdown', message.author.avatarURL())
          exampleEmbed.setDescription(`Countdown in ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
          exampleEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
          
          database.list().then(keys => {
            console.log(keys.length)
             database.set(`CDX${keys.length + 1}`, `${date},${time*1000},${message.channelId},${message.id}` ).then(() => {});
          
          });
          database.list().then(keys => {
            console.log(keys)
          });

            message.reply({
            embeds: [exampleEmbed]
          });
          console.log(time);
            setTimeout(()=>{
              exampleEmbed.setAuthor(`Countdown Complete`,message.author.avatarURL())
              exampleEmbed.setDescription(`Countdown complete (${hours} hours, ${minutes} minutes, ${seconds} seconds)`)
              exampleEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
              message.reply({
                embeds:[exampleEmbed]
              })
            },time*1000)
        } //cd command end
        break

      case `alarm`:

      function convertToDate(arg){
        if (args.length < 2){
        message.reply(`Type your command properly!`)
        return "false"
        }
        let year = 2021
        let month
        let day
        let hours //in hours:minutes
        let minutes 
        let title = "Tilt"
        let timezone = `GMT`
        for (let i = 1;i <= (arg.length - 1);i++){
          console.log(arg[arg.length - 1])
          console.log(arg[i])
          if (arg[i].includes(`y`)){
             year = arg[i].substring(0,arg[i].length-1)
          } else if (arg[i].includes(`m`)){
             month = arg[i].substring(0,arg[i].length-1)
          } else if (arg[i].includes(`d`)){
             day = arg[i].substring(0,arg[i].length-1)
          } else if (arg[i].includes(`:`)){
             hours = arg[i].substring(0,arg[i][":"]-1)
             minutes = arg[i].substring(arg[i][":"]+1,arg[i].length)
          } else if (arg[arg.length-2] == arg[i]){
            timezone = normalizeZone(arg[i])
            console.log(timezone)
          } else if ((arg[arg.length - 1] == arg[i]) && (arg.length > 2)){
            title = arg[arg.length]
          } 
          else {
            message.reply(`Type your command properly! | Title only allows one word currently`)
            return false
          }
        }
        console.log(hours);
        console.log(minutes);
        let date
        try {
           date = new Date();
           date.setFullYear(year);
           date.setMonth(month-1);
           date.setDate(day);
          // date.setHours(hours);
          // date.setMinutes(minutes)
        } catch(error){

        }
        if (date == "Invalid Date"){
          message.reply(`Invalid numbers!`);
          return false
        }
        console.log(date)
        if ((date - Date.now())<= 0){
          message.reply(`Your alarm has already past!`)
          return false
        }
        return {
          "Title": title,
          "Time": (date - Date.now()),
          "Date": date.toDateString()       
        }
      }
      let alarmData = convertToDate(args)
      console.log(alarmData)
      if (!(alarmData == false)){
        const alarmEmbed = new MessageEmbed()
        alarmEmbed.setColor("#0099ff")
        alarmEmbed.setAuthor(`Alarm | ${alarmData["Title"]}`,message.author.avatarURL())
        alarmEmbed.setDescription(`Alarm set to ${alarmData["Date"]}`)

        message.reply({
          embeds: [alarmEmbed]
        })

        function runAtDate(date, func) {
          var now = (new Date()).getTime();
          var then = date.getTime();
          var diff = Math.max((then - now), 0);
          if (diff > 0x7FFFFFFF) //setTimeout limit is MAX_INT32=(2^31-1)
              setTimeout(function() {runAtDate(date, func);}, 0x7FFFFFFF);
          else
              setTimeout(func, diff);
        }
      }
      break

      case `help`: case `h`:

      const helpEmbed = new MessageEmbed()
      const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('Add the bot here!')
					.setStyle('LINK')
          .setURL('https://discord.com/api/oauth2/authorize?client_id=794202956945424415&permissions=395137313872&scope=bot%20applications.commands')
			);
      helpEmbed.setColor("#0099ff")
      helpEmbed.setAuthor(`Commands`,client.user.avatarURL())
      helpEmbed.setDescription(`Description of Tilt's commands`)
      helpEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
      console.log(Object.keys(commandList).length)
      for (let i = 1;i <= Object.keys(commandList).length;i++){
        helpEmbed.addFields(
          {name:commandList[i]["Command"],value:`${commandList[i]["Description"]}\n${commandList[i]["Example"]}`}
        )
      }

      message.reply(
        {
          embeds: [helpEmbed],
          components: [row]
        }
      ) //help end
      break;

      case `play`: case `p`:
      if (message.member.voice.channel){
        let playEmbed = new MessageEmbed()
        playEmbed.setDescription(`Click on the link to get in the fun! :partying_face:`)
        playEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
      if (args[1] == undefined){
        playEmbed.setColor("#FF0000")
        playEmbed.setTitle(`${message.author.username} has started a Youtube Together session in ${message.member.voice.channel.name}! :popcorn:`)
        playEmbed.setAuthor(`Youtube Together Session`,message.author.avatarURL())
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
        return message.channel.send({
          embeds: [playEmbed],
          content: `${invite.code}`
        });
        });
      }else if(args[1].toLowerCase() == "chess"){
         playEmbed.setColor("#FFFFFF")
        playEmbed.setTitle(`${message.author.username} has started a Chess session in ${message.member.voice.channel.name}! :chess_pawn:`)
        playEmbed.setAuthor(`Chess Session`,message.author.avatarURL())
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
        return message.channel.send({
          embeds: [playEmbed],
          content: `${invite.code}`
        });
        });
      }else if(args[1].toLowerCase() == "betrayal"){
         playEmbed.setColor("#FFFFFF")
        playEmbed.setTitle(`${message.author.username} has started a Betrayal (amogus style) session in ${message.member.voice.channel.name}! :question:`)
        playEmbed.setAuthor(`Betrayal Session`,message.author.avatarURL())
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'betrayal').then(async invite => {
        return message.channel.send({
          embeds: [playEmbed],
          content: `${invite.code}`
        });
        });
      };
      }else{
        message.reply(`You must be in a voice channel to run this command!`)
      }
      break

      case `shutup`: 
      
      if (args[1] != undefined){
        message.channel.send(`Shut up ${args[1]}`)
      }else{
          message.channel.send(`but why me`)
      }
      break

      case "quote": case "q":
      
      message.reply(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)

      break

      case "8ball":

      if (args.length < 3){
        message.reply("Do you have anything to say?")
        return
      }

      let eightMessage = new MessageEmbed()
      eightMessage.setDescription(":8ball:")

      for (let i=0;i<(args.length);i++){
        switch (args[i]){
          case "u": case "you": case "YOU": case "U":
          eightMessage.setFooter("Very doubtful.")
          message.reply({
            embeds: [eightMessage]
          })
          return
        }}
        eightMessage.setFooter(`${eightBall[Math.floor(Math.random()*eightBall.length)]}`)
        message.reply({
          embeds:[eightMessage]
        })


      break

      case "avatar":

      let avatarMessage = new MessageEmbed()

      if (!message.mentions.members.size){
      avatarMessage.setAuthor(`${message.author.username}'s Avatar`)
      avatarMessage.setImage(message.author.displayAvatarURL())
      }else{
        let avatarMention = message.mentions.members.first()
        avatarMessage.setAuthor(`${avatarMention.user.username}'s Avatar`)
        avatarMessage.setImage(avatarMention.user.displayAvatarURL())
      }

      message.channel.send({
        embeds:[avatarMessage]
      });

      break

      case "me":

            message.channel.send("not them")
      break


    }//switch end
  }
})

const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
arr.reverse();
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
keepAlive();
// Login to Discord with your client's token
client.login(process.env.token);


