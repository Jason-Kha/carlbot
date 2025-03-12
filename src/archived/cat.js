import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';

export default {
    data: new SlashCommandBuilder().setName('cat').setDescription('Show cat'),
    async execute(interaction) {
        // dotenv setup
        config();
        const CATAPI = process.env.CATAPI;

        // get data
        const url = 'https://api.thecatapi.com/v1/images/search?limit=1&api_key=' + CATAPI;
        const result = await axios.get(url);

        // show cat
        await interaction.reply({ content: 'Here is cat:', files: [result.data[0].url] });
    }
};
