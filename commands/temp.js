const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'q',
    description: 'ping',
    aliases: [],
    async execute(message, args, cmd, bot, Discord) {

        message.delete()
        sec = 8
        let a = sec > 3600 ? new Date(1000 * sec).toISOString().substr(11, 8).replace(/^[0:]+/, "") : new Date(1000 * sec).toISOString().substr(14, 5).replace(/^[0:]?/, "")
        //.toISOString().substr(14, 5)
        console.log (a)
        

    }

}