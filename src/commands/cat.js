import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';

export default {
    data: new SlashCommandBuilder().setName('cat').setDescription('Show cat'),
    async execute(interaction) {
        // dotenv setup
        config();
        const CATAPI = process.env.CATAPI;

        const url = 'https://api.thecatapi.com/v1/images/search?limit=1&api_key=' + CATAPI;

        const response1 = await axios.get(url);
        const response2 = await axios.get(response1.data[0].url, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response2.data, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: 'cat.png' });

        await interaction.reply({ content: 'Here is cat', files: [attachment] });
        return;
    }
};
