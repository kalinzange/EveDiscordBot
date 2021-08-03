module.exports = {
    name: 'a',
    description: 'Nothing',
    execute(client, message, args, Discord) {
        message.channel.send('a');
    }
}