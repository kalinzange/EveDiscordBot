const Scraper = require("images-scraper");
const { SlashCommandBuilder } = require("@discordjs/builders");

const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Searches for an image!")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Search something.")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply(
      "Searching for **" + interaction.options.getString("search") + "**"
    );
    const imageResults = await google.scrape(
      interaction.options.getString("search"),
      1
    );
    await interaction.editReply(imageResults[0].url);
  },
};
