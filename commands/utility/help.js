const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all the commands available!"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setAuthor(
        "Command List",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      );

    const commandFolders = fs.readdirSync("./commands");

    var category = "";
    var commands = [];

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      category = folder;

      for (const file of commandFiles) {
        commands.push(file.slice(0, -3));
      }

      embed.addFields({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: commands.map((command) => " `" + command + "`") + " ",
        inline: false,
      });
      commands = [];
    }
    embed.setFooter("Feel free to suggest a command idea!");

    interaction.reply({ embeds: [embed] });
  },
};
