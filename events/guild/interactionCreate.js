module.exports = async (Discord, bot, interaction) => {

    if (interaction.isButton()) {
        interaction.deferUpdate()
        const command = bot.commands.get("play")
        command.work(interaction, bot, Discord);
        //console.log(interaction)
    }
    
}