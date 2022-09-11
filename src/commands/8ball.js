import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask a question for the all-knowing Carl')
        .addStringOption((option) =>
            option.setName('question').setDescription('Question to be answered').setRequired(true)
        ),
    async execute(interaction) {
        // get options
        const question = interaction.options.getString('question');

        // possible outcomes
        const answers = [
            { id: 1, text: 'It is certain.' },
            { id: 2, text: 'It is decidedly so.' },
            { id: 3, text: 'Without a doubt.' },
            { id: 4, text: 'Yes definitely.' },
            { id: 5, text: 'You may rely on it.' },
            { id: 6, text: 'As I see it, yes.' },
            { id: 7, text: 'Most likely.' },
            { id: 8, text: 'Outlook good.' },
            { id: 9, text: 'Yes.' },
            { id: 10, text: 'Signs point to yes.' },
            { id: 11, text: 'Reply hazy, try again.' },
            { id: 12, text: 'Ask again later.' },
            { id: 13, text: 'Better not tell you now.' },
            { id: 14, text: 'Cannot predict now.' },
            { id: 15, text: 'Concentrate and ask again.' },
            { id: 16, text: "Don't count on it." },
            { id: 17, text: 'My reply is no.' },
            { id: 18, text: 'My sources say no.' },
            { id: 19, text: 'Outlook not so good.' },
            { id: 20, text: 'Very doubtful.' }
        ];

        // calculate roll
        const roll = Math.floor(Math.random() * 20) + 1;

        // reply with roll
        await interaction.reply(`Question: ${question}\nAnswer: ${answers[roll].text}`);
        return;
    }
};
