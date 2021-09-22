const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, StreamType, AudioPlayerStatus } = require('@discordjs/voice')
const queue = new Map();
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'play',
    description: 'Joins and plays a video from youtube',
    aliases: ['p', 'skip', 'stop', 'test'],
    async work(button, bot, Discord) {
        const server_queue = queue.get(button.guild.id);

        switch (button.customId) {
            case "buttonSkip":
                console.log("Skipped")
                skip_song(button, server_queue, bot)
                break
            case "buttonStop":
                console.log("Stopped")
                stop_song(button, server_queue, bot)
                break
        }
    },
    async execute(message, args, cmd, bot, Discord) {

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return userInputConsole(message, [bot, "Oi, you need to be in VC lah! Anyhow only"], "error");
        /* Insert permission check later maybe? i lazy */

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play' || cmd === 'p') {

            message.delete()
            if (!args.length) return userInputConsole(message, [bot, "You need to send the second argument"], "error");
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]).catch(err => {return});
                if (!song_info) {
                    return userInputConsole(message, [bot, "Error finding video"], "error");
                }
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: song_info.videoDetails.lengthSeconds, videoID: song_info.videoDetails.videoId }
            } else {
                //If video is not a URL then use keywords to find
                const videoFinder = async (query) => {
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url, duration: video.duration.seconds, videoID: video.videoId }
                } else {
                    userInputConsole(message, [bot, "Error finding video"], "error");
                }
            }

            if (!server_queue) {

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }

                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);

                try {
                    const connection = joinVoiceChannel({
                        channelId: voice_channel.id,
                        guildId: voice_channel.guild.id,
                        adapterCreator: voice_channel.guild.voiceAdapterCreator
                    });
                    queue_constructor.connection = connection;
                    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
                    video_player(message, queue_constructor.songs[0])
                    await updateQueue(message);
                    userInputConsole(message, song, "play");
                } catch (err) {
                    queue.delete(message.guild.id);
                    userInputConsole(message, [bot, "There was an error connecting!"], "error");
                    throw err;
                }

            } else {

                server_queue.songs.push(song);
                await updateQueue(message);
                userInputConsole(message, song, "play");
                return
            }
        }

        else if (cmd === 'skip') {
            skip_song(message, server_queue, bot)
            message.delete()
        }
        else if (cmd === 'stop') {
            stop_song(message, server_queue, bot)
            message.delete()
        }
        else if (cmd === 'test') updateQueue(message);

    }
}

const video_player = async (message, song) => {
    const guild = message.guild
    const song_queue = queue.get(guild.id);

    if (!song) {
        song_queue.connection.destroy();
        queue.delete(guild.id);
        return;
    }

    const player = createAudioPlayer()
    const stream = await ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
    });

    player.play(resource);
    entersState(player, AudioPlayerStatus.Playing, 5e3);
    song_queue.connection.subscribe(player);
    player.on('error', (err) => {
        console.log(err)
    })

    player.on(AudioPlayerStatus.Idle, () => {
        song_queue.songs.shift();
        video_player(message, song_queue.songs[0]);
        updateQueue(message);        
    })

    //await song_queue.text_channel.send(`${guild.emojis.cache.get('591214274685304833')} Now playing ***${song.title}***`)
}

const skip_song = async (message, server_queue, bot) => {
    if (!message.member.voice.channel) return userInputConsole(message, [bot, "Oi, you need to be in VC lah! Anyhow only"], "error")
    if (!server_queue) {
        return userInputConsole(message, [bot, "Bruh got no song in queue, what talking u!"], "error");
    }
    await userInputConsole(message, server_queue.songs[0], "skip")
    server_queue.songs.shift();
    video_player(message, server_queue.songs[0]);
    updateQueue(message);
}

const stop_song = async (message, server_queue, bot) => {
    if (!message.member.voice.channel) return userInputConsole(message, [bot, "Oi, you need to be in VC lah! Anyhow only"], "error")
    server_queue.songs = [];
    server_queue.connection.destroy();
    queue.delete(message.guild.id);
    
    await updateQueue(message);
    userInputConsole(message, null, "stop")    
}

const updateQueue = async (message) => {
    let server_queue = queue.get(message.guild.id)
    const firstMsg = (await message.channel.messages.fetch({ after: 1, limit: 1 })).first();
    const videoDuration = (sec) => { return sec > 3600 ? new Date(1000 * sec).toISOString().substr(11, 8).replace(/^[0:]+/, "") : new Date(1000 * sec).toISOString().substr(14, 5).replace(/^[0:]?/, "") }
    let playEmb

    let queueStr = ""
    let queueCount = 1
    let queueTotalDuration = 0
    
    if (!server_queue) {
        playEmb = new MessageEmbed(firstMsg.embeds[0].setDescription(`Nothing is playing! =p to play`).setThumbnail(''))
        playEmb.fields[0] = { name: "\u200B", value: `\`Length:\` ⠀⠀⠀⠀⠀\`Requested by:\` *I haven implement yet*` }
    } else {
        server_queue.songs.slice(1).forEach(s => {
            queueStr += `\`${queueCount++}:\` [${s.title}](${s.url}) | \`${videoDuration(s.duration)}\`\n`;
            queueTotalDuration += s.duration
        })
        playEmb = new MessageEmbed(firstMsg.embeds[0].setDescription(`[${server_queue.songs[0].title}](${server_queue.songs[0].url})`).setThumbnail(`https://img.youtube.com/vi/${server_queue.songs[0].videoID}/0.jpg`))
        playEmb.fields[0] = { name: "\u200B", value: `\`Length:\` ${videoDuration(server_queue.songs[0].duration)}⠀⠀⠀⠀⠀\`Requested by:\` *I haven implement yet*` }
    }

    let queueEmb = new MessageEmbed(firstMsg.embeds[1]).setDescription("__**Up Next**__\n" + queueStr);
    queueEmb.fields[0] = { name: "\u200B", value: `**${queueCount - 1} songs in queue | ${videoDuration(queueTotalDuration)} total length**` }

    await firstMsg.edit({ embeds: [playEmb, queueEmb, firstMsg.embeds[2]] });
}

const userInputConsole = async (message, song, command) => {

    const firstMsg = (await message.channel.messages.fetch({ after: 1, limit: 1 })).first();
    const myDate = new Date(Date.now()).toLocaleTimeString('en-SG', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
    let descriptionArr = firstMsg.embeds[2].description.split("\n")

    const videoDuration = (sec) => { return sec > 3600 ? new Date(1000 * sec).toISOString().substr(11, 8).replace(/^[0:]+/, "") : new Date(1000 * sec).toISOString().substr(14, 5).replace(/^[0:]?/, "") }

    switch (command) {
        case "play":
            descriptionArr.unshift(`\`${myDate}\` >> ${message.member.nickname} added [${song.title}](${song.url}) (\`${videoDuration(song.duration)}\`)`)
            break
        case "skip":
            descriptionArr.unshift(`\`${myDate}\` >> ${message.member.nickname} skipped [${song.title}](${song.url}) (\`${videoDuration(song.duration)}\`)`)
            break
        case "stop":
            descriptionArr.unshift(`\`${myDate}\` >> ${message.member.nickname} stopped the music 👎`)
            break
        case "error":
            descriptionArr.unshift(`\`${myDate}\` >> ${song[0].user.username}: 🚫 ${song[1]}`)
            break
        default:
            break
    }

    if (descriptionArr.length > 10) descriptionArr.pop()
    await firstMsg.edit({ embeds: [firstMsg.embeds[0], firstMsg.embeds[1], firstMsg.embeds[2].setDescription(descriptionArr.join("\n"))] });

}
