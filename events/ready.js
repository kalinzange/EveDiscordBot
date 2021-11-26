require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v8");

module.exports = {
  name: "ready",
  once: true,
  execute(client, commands) {
    console.log("Evee is online");

    client.use;

    client.user.setPresence({
      activities: [{ name: "your requests!", type: "LISTENING" }],
      status: "online",
    });

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
