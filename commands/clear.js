const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear previous messages!")
    .addIntegerOption((option) =>
      option
        .setName("integer")
        .setDescription("Number of messages you want to delete.")
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.channel.bulkDelete(interaction.options.getInteger("integer"));
    await interaction.reply({
      content: "Done!",
      ephemeral: true,
    });
  },
};
