const Discord = require('discord.js');
const { token } = require ('./config.json'); 
const client = new Discord.Client();
const fs = require('fs');


client.commands = new Discord.Collection();
client.events = new discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})


client.login(token);