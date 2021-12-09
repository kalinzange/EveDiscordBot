const { MessageEmbed, Message } = require("discord.js");
const client = require("../main");

module.exports = {
  name: "messageUpdate",
  once: false,
  /**
   *
   * @param {Message} oldMessage
   * @param {Message} newMessage
   */
  execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;
    if (
      !client.channels.cache.find(
        (channelName) => channelName.name === "evee-logs"
      )
    )
      return;

    const serverId = newMessage.guild.id;
    const max = 1950;

    const original =
      oldMessage.content.slice(0, max) +
      (oldMessage.content.length > max ? " ..." : "");
    const edited =
      newMessage.content.slice(0, max) +
      (newMessage.content.length > max ? " ..." : "");

    const embedDescription =
      "This [message](" +
      newMessage.url +
      `) was edited by ${newMessage.author} in ${newMessage.channel}.` +
      "\n\n **Original**: \n ``` " +
      original +
      " ``` \n **Edited**: \n ``` " +
      edited +
      "```";

    const embed = new MessageEmbed()
      .setColor("#ffd500")
      .setTitle("**Message Edited**")
      .setAuthor(
        "Evee",
        "https://cdn.discordapp.com/avatars/775530325572976640/67386d9c99041abd20a890018ac2b497.png"
      )
      .setDescription(embedDescription.slice("0", "4096"))
      .setTimestamp()
      .setFooter(
        "Edited by: " + newMessage.author.tag,
        newMessage.author.displayAvatarURL()
      );

    client.channels.cache
      .find((channelName) => channelName.name === "evee-logs")
      .send({ embeds: [embed] });
  },
};
