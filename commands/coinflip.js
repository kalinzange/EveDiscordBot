module.exports = {
    name: 'coinflip',
    description: 'Throws a coin',
    async execute(message, client, Discord) {

        const coin = ['Cara', 'Coroa'];
        const flip = Math.round(Math.random());

        message.channel.send(coin[flip]);
    }
}