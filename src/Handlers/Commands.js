const { Perms } = require('$Validation/Permissions');

module.exports = async (client, PG, ascii) => {
    const Table = new ascii("Commands Loaded");

    CommandsArray = [];

    (await PG(`${process.cwd()}/src/Commands/**/*.js`)).map(async (file) => {
        const command = require(file);
        
        if (!command.name) {
        const L = file.split("/");
        return Table.addRow(`${command.name || "🟠 FAILED"}`, `INVALID: ${L[6] + `/` + L[7]}`);
        }

        if (!command.context && !command.description) 
            return Table.addRow(command.name, "🟠 FAILED", " MISSING DESCRIPTION");

        if (command.permission) {
            if (Perms.includes(command.permission)) command.defaultPermission = false;
            else return Table.addRow(file.split("/")[7], "🟠 FAILED", "INVALID PERMISSION");
        }
        if (!command.category) { Table.addRow(command.name, "🟠 FAILED", "MISSING CATEGORY") }

        client.commands.set(command.name, command);
        CommandsArray.push(command);
        await Table.addRow(command.name, 'LOADED', command.category);
    })

    console.log(Table.toString());

    client.on('ready', async () => {
        update(client)
    });

    client.on('guildCreate', async () => {
        update(client)
    });

}

async function update(client) {
    const Guilds = await client.guilds.cache.map(g => g.id);
    Guilds.forEach(async (g) => {
        const guild = await client.guilds.cache.get(g)
        guild.commands.set(CommandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                if (!cmdPerms) return null;
                return guild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
            }

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if (!roles) return accumulator;
                const permissions = roles.reduce((a, r) => {
                    return [...a, { id: r.id, type: "ROLE", permission: true }]
                }, []);

                return [...accumulator, { id: r.id, permissions }]
            }, []);

            await guild.commands.permissions.set({ fullPermissions });
        });
    })
}