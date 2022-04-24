// Discord Imports
const { Guild } = require('discord.js');
const GuildConfig = require('../Schemas/GuildConfig');

module.exports = {
    // Event Settings
    name: 'guildCreate',
    /**
     * @param {Guild} guild 
     */
    async execute(guild) {
        GuildConfig.findOne({ guildId: guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new GuildConfig({
                    guildId: guild.id
                })
                data.save()
            }
        })
    }
}