require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v8");

module.exports = {
  name: "ready",
  once: true,
  execute(client, commands) {
    console.log("Evee is online");

    client.use;

    const serverCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );

    const activities = [
      serverCount + " servers! |  /help",
      userCount + " users! |  /help",
    ];

    setInterval(() => {
      const status = activities[Math.floor(Math.random() * activities.length)];
      client.user.setPresence({
        activities: [{ name: `${status}`, type: "WATCHING" }],
      });
    }, 15000);

    const CLIENT_ID = client.user.id;

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);

    (async () => {
      try {
        if (process.env.ENV === "production") {
          await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
          });
          console.log("Commands Registered Globaly");
        } else {
          await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
            {
              body: commands,
            }
          );
          console.log("Commands Registered Locally");
        }
      } catch (err) {
        if (err) {
          console.error(err);
        }
      }
    })();
  },
};
