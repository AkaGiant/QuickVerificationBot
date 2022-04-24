const {
    Client
} = require("discord.js");


module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return client.commands.delete(interaction.commandName);
            return command.execute(interaction, client);
        }
    }
}