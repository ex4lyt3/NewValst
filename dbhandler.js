// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Database = require("@replit/database")

const quoteList = require('./quotes.js')

const db = new Database()

// Create a new client instance
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES
    });


db.list("CD").then(matches => {
  let i
  for (i in (matches.length)){
    setTimeout(() => {
      let time
      let channelid
      let messageid
      db.get(i).then(value => {
        channelid = value[3]
        messageid = value[4]
        time = (value[2]-(Date.now-value[1]))
      });
      client.channels.cache.get(channelid).fetchMessage(messageid).then(
      message => {
        setTimeout(()=>{
                exampleEmbed.setAuthor(`Countdown Complete`,message.author.avatarURL())
                exampleEmbed.setDescription(`Countdown complete ({hours} hours, {minutes} minutes, {seconds} seconds)`)
                exampleEmbed.setFooter(`"${quoteList[Math.floor(Math.random()*quoteList.length)]}"`)
                message.reply({
                  embeds:[exampleEmbed]
                })
              },time) //add .then (delete key)
      });
    }, 333)
  }
});
