const { SlashCommandBuilder } = require("@discordjs/builders");
const player = require("../client/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the song queue!"),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue?.playing)
      return interaction.reply("No songs are currently playing.");

    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((track, index) => {
      return `${index + 1}. [**${track.title}**](${track.url}) - ${
        track.requestedBy.tag
      }`;
    });

    return interaction.reply({
      embeds: [
        {
          title: "Music Queue",
          description: `${tracks.join("\n")}${
            queue.tracks.length > tracks.length
              ? `\n\n${
                  queue.tracks.length - tracks.length === 1
                    ? `${queue.tracks.length - tracks.length} more track`
                    : `${queue.tracks.length - tracks.length} more tracks`
                }`
              : ""
          }`,
          color: "#0099ff",
          fields: [
            {
              name: "Now Playing",
              value: `[**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
            },
          ],
        },
      ],
    });
  },
};
