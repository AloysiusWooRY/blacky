const { MessageActionRow, MessageButton } = require("discord.js")
const ytdl = require('ytdl-core');


module.exports = {
    name: 't',
    description: 'test',
    aliases: [],
    async execute(message, args, cmd, bot, Discord) {

        const playEmb = new Discord.MessageEmbed()
            .setTitle('Now Playing :musical_note:')
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            .setDescription('[Rick Astley - Never Gonna Give You Up (Official Music Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)')
            .addField("\u200B", "`Length:` 69:69⠀⠀⠀⠀⠀`Requested by:` Jia Hao")
            .setThumbnail('https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg')
            .setColor('#ff0000')

        const queueEmb = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Queue')
            .setURL("https://www.youtube.com/")
            .setDescription(
                "__**Up Next**__\n" +
                "`1.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`2.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`3.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`4.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`5.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`6.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`7.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`8.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`9.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n"
            )
            // .addFields(
            //     { name: '__Up Next__', value: "`1.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`" },
            //     { name: '\u200B', value: "`2.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`" },
            //     { name: '\u200B', value: "`3.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`" },
            //     { name: '\u200B', value: "`4.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`" },
            //     { name: '\u200B', value: "`5.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`" },
            //     // { name: '\u200B', value: "`6.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`" },
            //     // { name: '\u200B', value: "`7.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`" },
            //     // { name: '\u200B', value: "`8.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`" },
            //     // { name: '\u200B', value: "`9.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`" }
            // )
            .addField("\u200B", "**5 songs in queue | 18:39 total length**")

        const consoleEmb = new Discord.MessageEmbed()
            .setTitle("Console")
            .setColor("#0000ff")
            .setDescription(
                "`1.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`2.` Zoling skipped [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`3.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`4.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`5.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n"
            )


        const buttonSkip = new MessageButton()
            .setStyle('SUCCESS')
            .setCustomId('buttonSkip')
            .setLabel('Skip')
        const buttonStop = new MessageButton()
            .setStyle('DANGER')
            .setCustomId('buttonStop')
            .setLabel('Stop')
        const buttonScrollListL = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('buttonScollL')
            .setLabel('<< Prev Page')
        const buttonScrollListR = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('buttonScollR')
            .setLabel('Next Page >>')

        const buttonRow = new MessageActionRow().addComponents(buttonSkip, buttonStop)

        const testemb = new Discord.MessageEmbed()
            .setTitle("Console")
            .setColor("#0000ff")
            .setDescription(
                "`1.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`2.` Zoling skipped [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`3.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`4.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`5.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n"
            )


        // message.channel.send({ embeds: [playEmb, queueEmb, consoleEmb] })//[playEmb, queueEmb, consoleEmb]
        // const firstMsg = (await message.channel.messages.fetch({ after: 1, limit: 1 })).first();
        // firstMsg.edit({ components: [buttonRow] });

        message.delete()
        const song_info = await ytdl.getInfo(args[0]).catch((err) =>{});
        console.log(song_info)
    }
}


/* EMBED FIELDS */
        //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        //.setURL('https://discord.js.org/')
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        //.setTimestamp()
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        //.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');


/* Send individual embs as 1 msg each */
        // message.channel.send(playEmb).then(() => {
        //     message.channel.send({ embed: [queueEmb] }).then(() => {
        //         message.channel.send(consoleEmb, { buttons: [buttonSkip, buttonStop, buttonScrollListL, buttonScrollListR] }) //embed: {, queueEmb},
        //     })
        // });

/* Delete all messages */
        // await message.channel.messages.fetch()
        //     .then(messages => {
        //         console.log(messages)
        //         messages.forEach(m => {
        //             m.delete();
        //         })
        //     })
        //     .catch(console.error);