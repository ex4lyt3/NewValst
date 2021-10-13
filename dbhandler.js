// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Database = require("@replit/database")

const quoteList = require('./quotes.js')

const database = new Database()

// Create a new client instance
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES]
    });

    database.list("CDX").then(matches => {
      let i
      console.log(matches)
      for (i = 0;i < matches.length; i++){
        console.log(matches[i])
        setTimeout(() => {
          let time
          let channelid
          let messageid
          database.get(`${matches[i]}`).then(value => {
            console.log(value)
            channelid = value[3]
            console.log(channelid)
            messageid = value[4]
            time = (value[2]-(Date.now-value[1]))
             client.channels.cache.get(channelid).fetchMessage(messageid).then(
          message => {
            setTimeout(()=>{
                    exampleEmbed.setAuthor(`Countdown Complete`,message.author.avatarURL())
                    exampleEmbed.setDescription(`Countdown complete ({hours} hours, {minutes} minutes, {seconds} seconds)`)
                    exampleEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
                    message.reply({
                      embeds:[exampleEmbed]
                    })
                  database.delete(i).then(() => {});
                  },time) 
          }); 
          });
          
        }, 333)
      }
    });