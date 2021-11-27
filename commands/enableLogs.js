const { SlashCommandBuilder } = require("@discordjs/builders");
const client = require("../main.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enable-logs")
    .setDescription("Will create a new channel for logs!"),
  async execute(interaction) {
    if (interaction.user.id != interaction.guild.ownerId)
      return interaction.reply(
        "You must be the owner of the server to use this command!"
      );

    if (
      client.channels.cache.find(
        (channelName) => channelName.name === "evee-logs"
      )
    ) {
      return interaction.reply(
        "There's already a channel with the name **evee-logs**, Evee is sending all of the logs to this channel!"
      );
    } else {
      // Creating Evee Logs Channel
      interaction.guild.channels
        .create("evee-logs", { reason: "Needed a channel to send the logs!" })
        .catch(console.error);
      interaction.reply(
        "\n \n The channel **evee-logs** was created and logs will be sent there, we recommend you to make this channel private!"
      );
    }
  },
};
