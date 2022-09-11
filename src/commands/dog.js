import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

export default {
    data: new SlashCommandBuilder().setName('dog').setDescription('Show one of carls dogs'),
    async execute(interaction) {
        // get data
        const url = 'https://dog.ceo/api/breeds/image/random';
        const result = await axios.get(url);

        // show dog
        await interaction.reply({ content: 'Here is dog:', files: [result.data.message] });
        return;
    }
};
