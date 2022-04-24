module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        // Set bots status
        console.log(`${client.user.tag} Logged In!`)
        
    }
}