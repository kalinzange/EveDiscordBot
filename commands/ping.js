const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction) {
    await interaction.reply("Pinging...");
    const latency = Date.now() - interaction.createdTimestamp;
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("🏓  Pong")
      .setDescription("Latency is " + latency + "ms.");
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
