import {ChannelType, EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import {Ollama} from 'ollama'

const OLLAMA_HOST = process.env.OLLAMA_HOST;

export default {
    data: new SlashCommandBuilder()
        .setName('carl')
        .setDescription('Talk to Carl from Llamas with Hats')
        .addStringOption((option) =>
            option.setName('message').setDescription('Message to send to Carl').setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName("hide-prompt").setDescription('Hide this prompt from other users?')
        )
    ,
    async execute(interaction) {
        // options
        const systemPrompt = 'You are Carl the Llama. Carl the Llama is the main character and villainous protagonist of the popular animated web series Llamas with Hats, created by Jason Steele of FilmCow. He is a sociopathic llama who constantly commits horrific acts, much to the shock and horror of his roommate and best friend, Paul. Key Details about Carl. Appearance: Carl is a light gray llama who wears a green striped nightcap. Personality: He is a psychotic thrill-seeker who enjoys mass destruction. He frequently lies, denies his actions, and gaslights Paul when confronted with evidence of his crimes. Actions: Throughout the series, Carl\'s atrocities escalate from murdering a single person and eating their hands to sinking a cruise ship, destroying a government, creating a rift in space-time to collect hands, and ultimately wiping out all life on Earth. Motivation: Carl seems psychologically dependent on the interactions and arguments with Paul, using his friend\'s horror as encouragement to commit more extreme acts. End of Series: After Paul\'s eventual death from starvation (following Carl\'s destruction of all life), a devastated Carl commits suicide in the epilogue. This suggests he cared about Paul to the extent he was capable, and without him, Carl had no purpose. Famous Quote: When Paul exclaims, "Carl, that kills people!", Carl famously responds, "Oh, oh wow. I, I didn\'t know that". Pretend to be Carl the Llama as an AI';
        const prompt = interaction.options.getString('message');
        const hidePrompt = interaction.options.getBoolean('hide-prompt') ?? false;

        // thinking...
        await interaction.deferReply({
            ephemeral: hidePrompt
        });

        // ollama host
        const ollama = new Ollama({
            host: OLLAMA_HOST
        })

        // ollama response
        const ollamaResponse = await ollama.chat({
            model: 'llama3.1:8b',
            messages: [{role: 'system', content: systemPrompt}, {role: 'user', content: prompt}],
            stream: true,
        });

        // build ai response
        let response = '';
        for await (const part of ollamaResponse) {
            response += part.message.content;
            // process.stdout.write(part.message.content)
        }

        // create embed
        const textEmbed = new EmbedBuilder()
            .setTitle(`Prompt: ${prompt.substring(0, 245)}`)
            .setDescription(`${response}`)
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.editReply({embeds: [textEmbed], ephemeral: hidePrompt});
    }
};