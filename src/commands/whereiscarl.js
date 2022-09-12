import { SlashCommandBuilder } from 'discord.js';
import StaticMaps from 'staticmaps';

export default {
    data: new SlashCommandBuilder().setName('whereiscarl').setDescription('Find Carl'),
    async execute(interaction, client) {
        // get random location
        const longitude = parseFloat((Math.random() * 360 - 180).toFixed(3));
        const latitude = parseFloat((Math.random() * 180 - 90).toFixed(3));
        const center = [longitude, latitude];

        // random zoom level
        const zoom = Math.floor(Math.random() * 9) + 5;

        // map options
        const options = {
            width: 1024,
            height: 1024,
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileSubdomains: ['a', 'b', 'c'],
            tileRequestLimit: 5,
            tileSize: 256
        };

        // create new map
        const map = new StaticMaps(options);

        // create carl marker
        const marker = {
            img: `${client.user.displayAvatarURL({ size: 64 })}`,
            offsetY: 100,
            width: 64,
            height: 64,
            coord: center
        };

        // text marker
        const text = {
            coord: center,
            text: `Carl`,
            size: 30,
            width: 1,
            offsetY: 110,
            fill: '#ff0000',
            color: '#ff0000',
            font: 'Calibri',
            anchor: 'middle'
        };

        // circle text
        const circleText = {
            coord: center,
            text: `.`,
            size: 100,
            width: 1,
            fill: '#ff0000',
            color: '#ff0000',
            font: 'Calibri',
            anchor: 'middle'
        };

        // add to map
        map.addMarker(marker);
        map.addText(text);
        map.addText(circleText);

        try {
            // render map image
            await map.render(center, zoom);
            const buffer = await map.image.buffer('image/jpg', { quality: 100 });

            // reply with location and rendered image
            await interaction.reply({
                content: `I am at Latitude: ${latitude}, Longitude: ${longitude} \n<https://www.openstreetmap.org/#map=${
                    zoom + 1
                }/${latitude}/${longitude}>`,
                files: [{ attachment: buffer }]
            });
        } catch (err) {
            console.log(err);
        }

        return;
    }
};
