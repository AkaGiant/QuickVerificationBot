const { Client, CommandInteraction } = require('discord.js');
const GuildConfig = require('../Schemas/GuildConfig');

module.exports = {
    name: 'verify',
    description: 'Check a users Verification Status',
    category: 'Verification',
    options: [
        {
            name: "set",
            description: "Set the verification channel",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The TEXT channel you want to set this too.",
                    type: "CHANNEL",
                    required: true
                }
            ]
        }
    ],
    /**
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        const { options, guild } = interaction

        const TYPE = options.getSubcommand(['set']);

        switch(TYPE) {
            case "set": {
                const CHANNEL = options.getChannel("channel");
                if (CHANNEL.isText()) {
                    await GuildConfig.updateOne({ guildId: guild.id }, 
                        { $set: {"channels.verificationChannel": CHANNEL.id }})
                    console.log('good');
                } else return interaction.reply({ content: "Invalid Channel Type", ephemeral: true })
                
            }
        }
    }
}