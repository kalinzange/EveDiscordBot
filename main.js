const Discord = require('discord.js');
const { token, prefix } = require ('./config.json'); 
const client = new Discord.Client();
const fs = require('fs');


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Evee is online');
});
 
client.on('message', message => {

    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {

        case 'a': 
            client.commands.get('a').execute(message, args);
        break;

        case 'p':
            client.commands.get('play').execute(message);
        break;

        case 'play':
            client.commands.get('play').execute(message);
        break;

    }
});
/*
function skip (message, ServerQueue) {
    if(!message.member.voice.channel) return message.channel.send("Precisas de estar num canal de voz para parar a música!");
    if(!ServerQueue) return message.channel.send("Não há musicas para dar Skip!")
    ServerQueue.connection.Dispatcher.end();
}

function stop (message, ServerQueue) {
    if(!message.member.voice.channel) return message.channel.send("Precisas de estar num canal de voz para parar a música!");
    if(!ServerQueue) return message.channel.send("Não há musicas para parar!")
    ServerQueue.song = [];
    ServerQueue.connection.Dispatcher.end();
}
*/
client.login(token);