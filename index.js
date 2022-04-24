require('dotenv').config();
require('reflect-metadata');

const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 })

const mongoose = require('mongoose');

const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const Ascii = require('ascii-table');

client.commands = new Collection();

["Events", "Commands"].forEach(handler => {
    require(`./src/Handlers/${handler}`)(client, PG, Ascii)
});


(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Unable to connect to MongoDB Database.\nError: ' + err)
    })

    client.login(process.env.BOT_TOKEN);
})();