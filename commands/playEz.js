const ytSearch = require('yt-search');
const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');
module.exports = {
    name: 'w',
    description: 'Joins and plays a video from youtube',
    execute: async (msg, arg, cmd, client, Discord) => {
        const voiceChannel = msg.member.voice.channel;

        if (!voiceChannel) return msg.channel.send('You need to be in a channel to execute this command!');
        if (!arg.length) return msg.channel.send('You need to send the second argument!');

        const connection = voice.joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: msg.channel.guild.voiceAdapterCreator,
        });
        try{
            await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 30e3);
        } catch(error) {
            connection.destroy();
            return console.error(error);
        }

    
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

        }
        const keywords = await arg.join(' ')
        const video = await videoFinder(keywords);

        if (video) {
            const videoinfo = await ytdl.getInfo(video.url);
            try{
                var stream = await ytdl.downloadFromInfo(videoinfo);
            } catch (error){
                msg.reply(`Error while creating stream`);
                return console.error(error);
            }
            
            const player = voice.createAudioPlayer()
            const resource = voice.createAudioResource(stream, {
                inputType: voice.StreamType.Arbitrary,
                inlineVolume: true
            });

            player.play(resource);
            voice.entersState(player, voice.AudioPlayerStatus.Playing, 5e3);
    

            connection.subscribe(player);

            player.on('subscribe', async () => {
                await msg.reply(`:thumbsup: Now Playing ***${video.title}***`);
            });
        } else{
            msg.reply('No Results Found')
        }
        
    }
}