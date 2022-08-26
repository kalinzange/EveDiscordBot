const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/guildSettingsSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-logs-channel")
    .setDescription("Will create a new channel for logs")
    .addChannelOption((option) =>
      option
        .setName("logs")
        .setDescription(
          "Channel where your edit and delete messages will be logged"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])
    ) {
      return interaction.reply({
        content: "You do not have the permissions to use this command.",
        ephemeral: true,
      });
    }

    GuildSettings.findOne(
      { guild_id: interaction.guild.id },
      (err, settings) => {
        if (err) {
          console.error(err);
          return interaction.reply({
            content: "An error occurred while executing that command.",
            ephemeral: true,
          });
        }

        if (!settings) {
          settings = new GuildSettings({
            guild_id: interaction.guild.id,
            logs_channel_id: interaction.options.getChannel("logs").id,
          });
        } else {
          settings.logs_channel_id = interaction.options.getChannel("logs").id;
        }

        settings.save((err) => {
          if (err) {
            console.error(err);
            return interaction.reply({
              content: "An error occurred while executing that command.",
              ephemeral: true,
            });
          }

          interaction.reply(
            `Logs channel has been set to ${interaction.options.getChannel(
              "logs"
            )}!`
          );
        });
      }
    );
  },
};
