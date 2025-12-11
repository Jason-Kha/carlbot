import {ChannelType, EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import {Ollama} from 'ollama'

const OLLAMA_HOST = process.env.OLLAMA_HOST;

export default {
    data: new SlashCommandBuilder()
        .setName('ollama')
        .setDescription('Generate text using a prompt')
        .addStringOption((option) =>
            option.setName('prompt').setDescription('Text prompt to pass into Ollama').setRequired(true)
        )
    ,
    async execute(interaction) {
        // thinking...
        await interaction.deferReply({
            ephemeral: false
        });

        const prompt = interaction.options.getString('prompt');

        // ollama host
        const ollama = new Ollama({
            host: OLLAMA_HOST
        })

        // ollama response
        const ollamaResponse = await ollama.chat({
            model: 'llama3.1:8b',
            messages: [{role: 'user', content: prompt}],
            stream: true,
        });

        // build ai response
        let response = ''
        for await (const part of ollamaResponse) {
            response += part.message.content;
            // process.stdout.write(part.message.content)
        }

        // create embed
        const textEmbed = new EmbedBuilder()
            .setTitle(`Prompt: ${prompt}`)
            .setDescription(`${response}`)
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.editReply({embeds: [textEmbed]});
    }
};