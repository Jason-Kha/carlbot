import { SlashCommandBuilder } from 'discord.js';
import StaticMaps from 'staticmaps';

export default {
    data: new SlashCommandBuilder().setName('whereiscarl').setDescription('Find Carl'),
    async execute(interaction) {
        // get random location
        const longitude = (Math.random() * 360 - 180).toFixed(3);
        const latitude = (Math.random() * 180 - 90).toFixed(3);

        // map options
        const options = {
            width: 512,
            height: 512,
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileSubdomains: ['a', 'b', 'c'],
            zoomRange: 13,
            tileSize: 256,
            tileRequestLimit: 2
        };

        // create new map
        const map = new StaticMaps(options);
        const text = {
            coord: [longitude, latitude],
            text: `${longitude}, ${latitude}`,
            size: 30,
            width: 1,
            fill: '#0000FF',
            color: '#0000FF',
            font: 'Calibri',
            anchor: 'end'
        };

        map.addText(text);

        // render map
        await map.render([longitude, latitude], 13);

        const buffer = await map.image.buffer('image/jpeg', { quality: 75 });

        // reply with location
        await interaction.reply({
            content: `Carl is at Longitude: ${longitude}, Latitude: ${latitude}\nhttps://www.openstreetmap.org/#map=10/${latitude}/${longitude}`,
            files: [{ attachment: buffer }]
        });
        return;
    }
};
