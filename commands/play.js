const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'pause', 'resume'],
    description: 'Play requested musics',
    async execute(message, args, cmd, client, Discord) {
        const mpengu = client.emojis.cache.get("871833279609839626")

        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.channel.send('Precisas de estar em uma sala para executar este comando.');
        
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('Não tenho permissões para entrar nessa sala :(');
        if(!permissions.has('SPEAK')) return message.channel.send('Não tenho permissões para falar nessa sala :(');

        const serverQueue = queue.get(message.guild.id);

        switch (cmd) {
            case 'play':
                if(!args.length) return message.channel.send('Como queres que coloque música se nem nome ou link colocaste?! :unamused: ');
                let song = {};

                if(ytdl.validateURL(args[0])) {

                    const songInfo = await ytdl.getInfo(args[0])
                    song = {title: songInfo.videoDetails.title, url:songInfo.videoDetails.video_url}

                } else {

                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0]:null;
                    }

                    const video = await videoFinder (args.join(' '));
                    if (video) {

                        song = { title: video.title, url: video.url }

                    } else {

                        message.channel.send('Erro ao encontrar o video');

                    }
                }

                if(!serverQueue) {
                    const queueContructor = {
                        voiceChannel: voiceChannel,
                        textChannel: message.channel,
                        connection: null,
                        songs: []
                    }

                    queue.set(message.guild.id, queueContructor);
                    queueContructor.songs.push(song);

                    try {

                        const connection = await voiceChannel.join();
                        queueContructor.connection = connection;
                        videoPlayer(message.guild, queueContructor.songs[0]);

                    } catch (err) {

                        queue.delete(message.guild.id);
                        message.channel.send('Encontrei um erro ao conectar-me, entretanto apaguei a lista de queue');
                        throw err;

                    }

                } else {
                    serverQueue.songs.push(song);
                    return message.channel.send(`${mpengu} **${song.title}** adicionado à queue!`);
                }
            break;
            
            case 'skip':
                skipSong(message, serverQueue);
            break;

            case 'stop':
                stopSong(message, serverQueue);
            break;

            case 'pause':
                pauseSong(message, serverQueue);
            break;

            case 'resume':
                resumeSong(message, serverQueue);
            break;
        }
    }
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if(!song) {
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly'});
    songQueue.connection.play(stream, {seek: 0, volume: 0.5})
    .on('finish', () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });

    await songQueue.textChannel.send(`:notes: A Tocar: **${song.title}**`);

}

const skipSong = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send('Precisas de estar num canal para executar este comando');
    if (!serverQueue) return message.channel.send('Não existe nenhuma música em queue');
    serverQueue.connection.dispatcher.end();
}

const stopSong = (message, serverQueue) => {
    if(!message.member.voice.channel) return message.channel.send('Precisas de estar num canal para executar este comando');
    if(!serverQueue) return message.channel.send('Não existem músicas em queue');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

const pauseSong = (message, serverQueue) => {
    if(!message.member.voice.channel) return message.channel.send('Precisas de estar num canal para executar este comando');
    if(serverQueue.connection.dispatcher.paused) return message.channel.send("A música já está pausada!");
    serverQueue.connection.dispatcher.pause();
    message.channel.send("Pausei a música!");
}

const resumeSong = (message, serverQueue) => {
    if(!serverQueue.connection.dispatcher.paused) return message.channel.send("Música não está pausada!");
    serverQueue.connection.dispatcher.resume();
    message.channel.send("Rock n' Roll! :D");
}