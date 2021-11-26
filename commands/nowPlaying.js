const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const player = require("../client/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("now-playing")
    .setDescription("shows information about the current song"),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue?.playing)
      return interaction.reply({
        content: "No music is currently being played",
      });

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Now Playing")
      .setURL(queue.current.url)
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .setDescription(`**${queue.current.title}** (\`${perc.progress}%\`)`)
      .setThumbnail(queue.current.thumbnail)
      .addField("\u200b", progress)
      .setTimestamp()
      .setFooter(
        "Queued by " + queue.current.requestedBy.tag,
        queue.current.requestedBy.displayAvatarURL()
      );

    return interaction.reply({
      embeds: [embed],
    });
  },
};
