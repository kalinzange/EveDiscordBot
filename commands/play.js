const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const { MessageEmbed } = require("discord.js");
const player = require("../client/player");
const client = require("../main");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a requested song!")
    .addStringOption((option) =>
      option
        .setName("songtitle")
        .setDescription("Title of the song!")
        .setRequired(true)
    ),

  async execute(interaction) {
    const songTitle = interaction.options.getString("songtitle");

    interaction.reply(
      "Searching for: " + interaction.options.getString("songtitle")
    );

    if (!interaction.member.voice.channel)
      return interaction.followUp({
        content: "Please join a voice channel first!",
      });

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    const queue = player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("**" + queue.current.title + "**")
      .setURL(queue.current.url)
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .addFields(
        {
          name: "Views",
          value: queue.current.views.toLocaleString(),
          inline: true,
        },
        {
          name: "Duration",
          value: queue.current.duration.toString(),
          inline: true,
        }
      )
      .setImage(queue.current.thumbnail)
      .setTimestamp()
      .setFooter(
        "Queued by " + queue.current.requestedBy.tag,
        queue.current.requestedBy.displayAvatarURL()
      );

    interaction.editReply({ content: " ", embeds: [embed] });

    if (!queue.playing) await queue.play();
  },
};
