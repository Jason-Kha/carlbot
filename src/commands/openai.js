import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

export default {
    data: new SlashCommandBuilder()
        .setName('openai')
        .setDescription('Generate an image or text using OpenAI')
        .addStringOption((option) =>
            option.setName('prompt').setDescription('OpenAI Prompt').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription('Type of response')
                .setRequired(true)
                .addChoices(
                    { name: 'text', value: 'openai_text' },
                    { name: 'image', value: 'openai_image' }
                )
        ),
    async execute(interaction) {
        // dotenv setup
        config();
        const OPENAPI = process.env.OPENAI;

        const configuration = new Configuration({
            apiKey: OPENAPI
        });
        const openai = new OpenAIApi(configuration);

        // defer reply
        await interaction.deferReply();

        switch (interaction.options.getString('type')) {
            case 'openai_text':
                const textResponse = await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: interaction.options.getString('prompt'),
                    max_tokens: 300
                });
                // create embed
                const textEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.options.getString('prompt')}`)
                    .setDescription(`${textResponse.data.choices[0].text}`)
                    .setFooter({
                        text: interaction.client.user.username,
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();
                await interaction.editReply({ embeds: [textEmbed] });
                break;

            case 'openai_image':
                const imageResponse = await openai.createImage({
                    prompt: interaction.options.getString('prompt'),
                    n: 1,
                    size: '512x512'
                });
                const imageURL = imageResponse.data.data[0].url;
                // create embed
                const imageEmbed = new EmbedBuilder()
                    .setTitle(`Carl AI`)
                    .addFields({
                        name: 'Prompt',
                        value: `${interaction.options.getString('prompt')}`,
                        inline: true
                    })
                    .setImage(imageURL)
                    .setFooter({
                        text: interaction.client.user.username,
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();
                await interaction.editReply({ embeds: [imageEmbed] });
                break;
        }

        return;
    }
};
