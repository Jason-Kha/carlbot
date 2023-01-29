import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

export default {
    data: new SlashCommandBuilder().setName('printer').setDescription('3D Printer Screenshot'),
    async execute(interaction) {
        // get data
        const url = 'http://192.168.1.253:3000/static_simple.html';
        const result = await axios.get(url);

        // show dog
        await interaction.reply({ content: 'Here is dog:', files: [result.data.message] });
        return;
    }
};
