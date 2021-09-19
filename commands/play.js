const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { VoiceChannel } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Joins and plays a video from youtube',
    aliases: ['p', 'pl'],
    async execute(bot, message, cmd, args, Discord) {
        const voice_channel = message.member.voice.channel;

        if (!voice_channel) return message.channel.send("Oi, you need to be in VC lah!")
        if (!args.length) return message.channel.send('Play waht?')

        const validURL = (str) => {
            let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if (!regex.test(str)) {
                return false;
            } else {
                return true;
            }
        }

        if (validURL(args[0])) {
            const connection = await voice_channel.join();
            const stream = ytdl(args[0], { filter: 'audioonly' });

            connection.play(stream, { seek: 0, volume: 1 })
                .on('finish', () => {
                    voice_channel.leave();
                    message.channel.send("I'm done, bye bye");
                });

            await message.channel.send(`${bot.emojis.cache.get('591214274685304833')} Now playing ***${args[0]}***`)
        }

        const connection = await voice_channel.join();
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

        }

        const video = await videoFinder(args.join(' '));

        if (video) {
            const stream = ytdl(video.url, { filter: 'audioonly' });
            connection.play(stream, { seek: 0, volume: 1 })
                .on('finish', () => {
                    voice_channel.leave();
                    message.channel.send("I'm done, bye bye");
                });

            message.channel.send(`${bot.emojis.cache.get('591214274685304833')} Now playing ***${video.title}***`)
        } else {
            message.reply("Wat talking you, cannot find lah!")
        }

    }

}
