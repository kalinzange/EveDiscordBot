require("dotenv").config();
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

module.exports = client;

// Command Handler
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

// Event Handler
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

client.login(process.env.TOKEN);
