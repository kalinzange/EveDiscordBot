const Discord = require('discord.js');
const { token } = require ('./config.json');
const client = new Discord.Client();
const prefix = '.';
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
    }
});

client.login(token);