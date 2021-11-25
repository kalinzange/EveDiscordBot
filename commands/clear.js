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
    if (interaction.options.getInteger("integer") < 1) {
      interaction.reply({
        content: "Your number needs to be greater or equal to 1!",
        ephemeral: true,
      });
    } else {
      interaction.channel.bulkDelete(interaction.options.getInteger("integer"));

      var msg = "";

      if (interaction.options.getInteger("integer") === 1) {
        msg = " message!";
      } else {
        msg = " messages!";
      }

      await interaction.reply({
        content: "Cleared " + interaction.options.getInteger("integer") + msg,
        ephemeral: true,
      });
    }
  },
};
