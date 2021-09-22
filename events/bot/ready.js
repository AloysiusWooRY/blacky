module.exports = (blank, Discord, bot) => {
    console.log(`${bot.user.username} is ready!`);//${bot.user.username}

    bot.user.setActivity("with alpha v1.0", {type: 'PLAYING'})
}