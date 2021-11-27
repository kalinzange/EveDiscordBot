const { MessageEmbed, Message } = require("discord.js");
const client = require("../main");

module.exports = {
  name: "messageDelete",
  once: false,
  /**
   *
   * @param {Message} message
   */
  execute(message) {
    if (message.author.bot) return;
    if (
      !client.channels.cache.find(
        (channelName) => channelName.name === "evee-logs"
      )
    )
      return;

    const embedDescription =
      `A message sent by ${message.author} was deleted.` +
      "\n\n **Deleted Message**: \n ``` " +
      `${message.content ? message.content : "None"}` +
      "```";

    const embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("**Message Deleted**")
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .setDescription(embedDescription.slice("0", "4096"))
      .setTimestamp()
      .setFooter(
        "Sent by: " + message.author.tag,
        message.author.displayAvatarURL()
      );

    if (message.attachments.size >= 1) {
      embed.addField(
        "\n Attachments: ",
        `${message.attachments.map((attachment) => attachment.url)}`,
        true
      );
    }

    client.channels.cache
      .find((channelName) => channelName.name === "evee-logs")
      .send({ embeds: [embed] });
  },
};
