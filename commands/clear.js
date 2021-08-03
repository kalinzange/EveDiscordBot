module.exports = {
    name: 'clear',
    description: 'Clear messages',
    async execute(message, args, cmd, client, Discord) {
        if(!args.length) return message.reply('preciso de saber o número de mensagens que queres apagar :unamused: ');
        if(isNaN(args[0])) return message.reply('preciso de um número real :unamused: ');
        if(args[0] > 100) return message.reply('só posso apagar até 100 mensagens :unamused: ');
        if(args[0] < 1) return message.reply('precisas apagar no mínimo 1 mensagem :unamused: ');

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}