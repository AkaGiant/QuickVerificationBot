const { Schema, model} = require('mongoose');

module.exports = model("GuildConfig", new Schema({
    guildId: String,
    channels: {
        verificationChannel: {
            type: String,
            default: null
        }
    }
}));