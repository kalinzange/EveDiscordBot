import Scraper from 'images-scraper';

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

module.exports = {
    name: 'image',
    description: 'Searches for an image',
    async execute(message, args, client, Discord) {
        const imageQuery = args.join(' ');
        if(!imageQuery) return message.channel.send('Escolhe uma imagem');

        const imageResults = await google.scrape(imageQuery, 1);
        message.channel.send(imageResults[0].url);
    }
}