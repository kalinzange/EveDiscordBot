const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Throws a coin!"),
  async execute(interaction) {
    const coin = ["Cara 🙃", "Coroa 👑"];
    const flip = Math.round(Math.random());
    await interaction.reply(coin[flip]);
  },
};
