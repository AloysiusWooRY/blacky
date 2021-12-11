const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] }); //{ partials: ["MESSAGE", "CHANNEL", "REACTION"] }
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(bot, Discord);
})

// bot.on('ready', () => {
//     console.log("Bot is online")
//     bot.user.setActivity("testing", {type: 'COMPETING', name: "abc"})
// })

bot.login(process.env.token); //process.env.token