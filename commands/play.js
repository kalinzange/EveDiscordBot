const ytdl = require("ytdl-core");
const queue = new Map();

module.exports = {
    name: 'play',
    description: 'play requested music',
    async execute(message) {
        try {
            const args = message.content.split(" ");
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) return message.channel.send("Precisas de estar num voice channel para tocares música!");
            
            const permissions = voiceChannel.permissionsFor(message.client.user);

            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return message.channel.send("Preciso de permissões para juntar-me a essa sala!");
            }
      
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url
            };
      
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
      
                queue.set(message.guild.id, queueContruct);
      
                queueContruct.songs.push(song);
      
                try {

                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    this.play(message, queueContruct.songs[0]);

                } catch (err) {

                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);

                }

            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} foi adicionado há queue!`);
            }

        } catch (error) {
            console.log(error);
            message.channel.send(error.message);
        }
    },
      
    play(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);
      
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
      
        const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            this.play(message, serverQueue.songs[0]);
        })
        
        .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`A Tocar _tuc tuc_: **${song.title}**`);
    }
}