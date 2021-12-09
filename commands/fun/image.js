const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Scraper = require("images-scraper");

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
      "Searching for **" +
        interaction.options.getString("search").charAt(0).toUpperCase() +
        interaction.options.getString("search").slice(1) +
        "**"
    );
    const imageResults = await google.scrape(
      interaction.options.getString("search"),
      1
    );
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(
        "Searched for **" +
          interaction.options.getString("search").charAt(0).toUpperCase() +
          interaction.options.getString("search").slice(1) +
          "** 🔍"
      )
      .setURL(imageResults[0].url)
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .setDescription("Here is what you looking for!")
      .setImage(imageResults[0].url)
      .setTimestamp();
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
