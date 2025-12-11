import {ChannelType, SlashCommandBuilder} from 'discord.js';
import {
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
    StreamType,
    VoiceConnectionStatus
} from "@discordjs/voice";

import discordTTS from 'discord-tts'

export default {
    data: new SlashCommandBuilder()
        .setName('tts')
        .setDescription('Have this bot use text to speech in the voice channel')
        .addStringOption((option) =>
            option.setName('message').setDescription('Text to speech message').setMaxLength(200).setRequired(true)
        )
        .addChannelOption(option => option.setName('channel')
            .setDescription("The voice channel to join")
            .addChannelTypes(ChannelType.GuildVoice))
    ,
    async execute(interaction) {
        const {client} = interaction;

        // get channel ID
        let channelId;
        if (interaction.options.getChannel('channel') !== null) {
            channelId = interaction.options.getChannel('channel').id;
        } else {
            // get user's current voice channel
            const guild = await client.guilds.fetch(interaction.guildId);
            const user = await guild.members.fetch(interaction.user.id);

            // if user does not exist in any voice channel from the guild
            if (user.voice.channelId === null) {
                await interaction.reply({content: 'You are not in a voice channel!', ephemeral: true})
                return;
            } else {
                channelId = user.voice.channelId;
            }
        }

        // TTS message
        const message = interaction.options.getString('message');
        const stream = discordTTS.getVoiceStream(message);
        const resource = createAudioResource(stream);

        // channel connection configuration
        const connection = joinVoiceChannel({
            channelId: channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        const audioPlayer = createAudioPlayer();
        const subscription = connection.subscribe(audioPlayer);

        // play tts audio
        if (subscription) {
            await interaction.deferReply({
                ephemeral: true
            });
            await audioPlayer.play(resource);
            await interaction.editReply({content: `TTS Message: ${message}`, ephemeral: true});
            return;
        }

        // on disconnect
        audioPlayer.on("unsubscribe", () => {
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy()
            }
        });

        // disconnect handling
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_500),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                connection.destroy();
            }
        });
    }
};
