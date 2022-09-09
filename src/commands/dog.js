import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

export default {
    data: new SlashCommandBuilder().setName('dog').setDescription('Show one of carls dogs'),
    async execute(interaction) {
        const url = 'https://dog.ceo/api/breeds/image/random';

        const response1 = await axios.get(url);
        const response2 = await axios.get(response1.data.message, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response2.data, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: 'dog.png' });

        await interaction.reply({ content: 'Here is my food', files: [attachment] });
        return;
    }
};
