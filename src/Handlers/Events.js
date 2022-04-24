const { Events } = require('$Validation/EventNames');

module.exports = async (client, PG, ascii) => {
    const Table = new ascii("Events Loaded");
    (await PG(`${process.cwd()}/src/Events/**/*.js`)).map(async (file) => {
        const event = require(file);
        if (!Events.includes(event.name) || !event.name) {
            const L = file.split("/");
            await Table.addRow(`${event.name || "🟠 MISSING"}`, `INVALID: ${L[6] + `/` + L[7]}`);
            return;
        }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await Table.addRow(event.name,`LOADED`);
    });
    console.log(Table.toString());
    
}