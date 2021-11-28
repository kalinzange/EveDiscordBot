const { SlashCommandBuilder } = require("@discordjs/builders");
const player = require("../../client/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change or check the volume of the current song!")
    .addIntegerOption((option) =>
      option
        .setName("percentage")
        .setDescription("Percentage to change the volume to!")
        .setRequired(false)
    ),
  async execute(interaction) {
    const volumePercentage = interaction.options.getInteger("percentage");
    const queue = player.getQueue(interaction.guildId);
    if (!queue?.playing)
      return interaction.reply("No music is currently being played");

    if (!volumePercentage)
      return interaction.reply(`The current volume is \`${queue.volume}%\``);

    if (volumePercentage < 0 || volumePercentage > 100)
      return interaction.reply("The volume must be betweeen 1 and 100");

    queue.setVolume(volumePercentage);

    return interaction.reply(`Volume has been set to \`${volumePercentage}%\``);
  },
};
