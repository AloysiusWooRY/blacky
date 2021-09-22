module.exports = (Discord, bot, message) => {
    const prefix = '=';
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = bot.commands.get(cmd) || bot.commands.find(a => a.aliases && a.aliases.includes(cmd));

    // if(command) command.execute(bot, message, cmd, args, Discord);

    try {
        command.execute(message, args, cmd, bot, Discord);
    } catch (err) {
        message.reply("There was an error trying execute this command!");
        console.log(err);
    }
}
