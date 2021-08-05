module.exports = {
    name: 'a',
    description: 'Nothing',
    execute(message, args, cmd, client, Discord) {
        const emoji = client.emojis.cache.get("871833279609839626")
        message.channel.send(`${emoji}`);
    }
}

/* 
 * Usar Emojis Globally
 * const emoji = client.emojis.cache.get("871833279609839626")
 * message.channel.send(`${emoji}`);
 * 
*/