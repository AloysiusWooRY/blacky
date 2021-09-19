module.exports = {
    name: 'leave',
    description: 'stop',
    aliases: ['l', 'lv'],
    async execute(bot, message, cmd, args, Discord) {
        const voice_channel = message.member.voice.channel;

        if(!voice_channel) return message.channel.send("Oi, you need to be in VC lah!");
        console.log(123)
        message.channel.send(`Bye bye`);
        await voice_channel.leave();
        
        message.channel.send(`Bye bye ${bot.emojis.cache.get('591214274685304833')}`);
    }
}