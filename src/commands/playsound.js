import {SlashCommandBuilder, ChannelType} from 'discord.js';
import {
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus
} from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName('playsound')
        .setDescription('play sound').addChannelOption(option => option.setName('channel').setDescription("The channel to join").setRequired(true).addChannelTypes(ChannelType.GuildVoice))
        ,
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        const audioPlayer = createAudioPlayer()
        const resource = createAudioResource("resources/audio/carl.mp3")

        connection.on(VoiceConnectionStatus.Ready, () => {
            connection.setSpeaking(false);
            const subscription = connection.subscribe(audioPlayer);

            if (subscription) {
                setTimeout(() => {connection.setSpeaking(true);
                    audioPlayer.play(resource);connection.setSpeaking(false);

                }, 500);
                setTimeout(() => subscription.unsubscribe(), 3200);
            }
        });

        audioPlayer.on("unsubscribe", () => {connection.destroy()});

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
