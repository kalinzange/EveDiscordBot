module.exports = {
    name: 'decide',
    description: 'Randomly decides between multiple options',
    async execute(message, args, client, Discord) {

        if(!args.length) return message.channel.send('Decidir entre o quê :unamused: ');
        if(args.length < 2) return message.channel.send('Preciso de mais variáveis :unamused: ');

        const min = 0;
        const max = args.length;

        message.channel.send(args[Math.floor(Math.random() * (max - min) + min)]);
    }
}