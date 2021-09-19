module.exports = {
    name: 't',
    description: 'test',
    aliases: [],
    async execute(bot, message, cmd, args, Discord) {
        console.log(bot.emojis.cache.get('591214274685304833'))
        const a = bot.emojis.cache.get('591214274685304833');

        message.channel.send(`${a}`);
    }
}
