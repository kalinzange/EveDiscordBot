const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const { MessageEmbed } = require("discord.js");
const player = require("../client/player");

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
      return interaction.followUp("Please join a voice channel first!");

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

    const lastTrack = queue.tracks.length - 1;

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("**" + queue.tracks[lastTrack].title + "**")
      .setURL(queue.tracks[lastTrack].url)
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .addFields(
        {
          name: "Views",
          value: queue.tracks[lastTrack].views.toLocaleString(),
          inline: true,
        },
        {
          name: "Duration",
          value: queue.tracks[lastTrack].duration.toString(),
          inline: true,
        }
      )
      .setImage(queue.tracks[lastTrack].thumbnail)
      .setTimestamp()
      .setFooter(
        "Queued by " + queue.tracks[lastTrack].requestedBy.tag,
        queue.tracks[lastTrack].requestedBy.displayAvatarURL()
      );

    interaction.editReply({ content: " ", embeds: [embed] });

    if (!queue.playing) await queue.play();
  },
};
