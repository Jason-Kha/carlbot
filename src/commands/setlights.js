import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import pkg from 'tplink-smarthome-api';
const { Client } = pkg;

export default {
    data: new SlashCommandBuilder()
        .setName('setlights')
        .setDescription("mess with yoshi's light bulbs lol")
        .addBooleanOption((option) =>
            option.setName('powerstate').setDescription('Lightbulb state [true|false]')
        )
        .addNumberOption((option) =>
            option.setName('hue').setDescription('Lightbulb Hue [min:0 max:360]')
        )

        .addNumberOption((option) =>
            option.setName('saturation').setDescription('Lightbulb Saturation [min:0 max:100]')
        )
        /*
        .addNumberOption((option) =>
            option.setName('color_temp').setDescription('Lightbulb Color Temperature')
        )
        */
        .addNumberOption((option) =>
            option.setName('brightness').setDescription('Lightbulb Brightness [min:0 max:100]')
        )
        .addNumberOption((option) =>
            option
                .setName('transition_period')
                .setDescription('Light transition (in seconds) [min:0 max:30000]')
        ),

    async execute(interaction) {
        const { options } = interaction;
        const powerstate = options.getBoolean('powerstate');
        const hue = options.getNumber('hue');
        const saturation = options.getNumber('saturation');
        //const color_temp: number = options.getNumber('color_temp')!;
        const brightness = options.getNumber('brightness');
        const transition_period = options.getNumber('transition_period');

        // validation
        if (hue !== null && (hue < 0 || hue > 360)) {
            interaction.reply({ content: 'Invalid hue. [min:0 max:360]', ephemeral: true });
            return;
        }

        if (saturation !== null && (saturation < 0 || saturation > 100)) {
            interaction.reply({ content: 'Invalid saturation. [min:0 max:100]', ephemeral: true });
            return;
        }
        /*
        if (color_temp !== null && (color_temp < 2500 || color_temp > 6500)) {
            interaction.reply({
                content: 'Invalid saturation. [min:2500 max:6500]',
                ephemeral: true
            });
            return;
        }
        */
        if (brightness !== null && (brightness < 0 || brightness > 100)) {
            interaction.reply({ content: 'Invalid saturation. [min:0 max:100]', ephemeral: true });
            return;
        }
        if (transition_period !== null && (transition_period < 0 || transition_period > 30000)) {
            interaction.reply({
                content: 'Invalid transition period. [min:0 max:30000]',
                ephemeral: true
            });
            return;
        }

        // light client
        const client = new Client();
        const oldState = await (await client.getDevice({ host: '192.168.1.248' })).getInfo();

        // Look for bulb, log to console, and turn them on
        client.startDiscovery().on('bulb-new', async (bulb) => {
            await bulb.lighting.setLightState({
                on_off: powerstate,
                hue: hue,
                saturation: saturation,
                color_temp: 0,
                brightness: brightness,
                transition_period: transition_period
            });
        });

        const newState = await (await client.getDevice({ host: '192.168.1.248' })).getInfo();

        var newData = JSON.parse(JSON.stringify(newState.lighting));

        const newHue = newData['lightState']['hue'];
        const newSaturation = newData['lightState']['saturation'];
        const newBrightness = newData['lightState']['brightness'];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('YoshLamp Info')
            .setDescription('YoshLamp Status')
            .setThumbnail(interaction.client.user.avatarURL({ format: 'png', size: 4096 }))
            .addFields(
                { name: 'Description', value: `ur messin with my lights >:o` },
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Hue',
                    value: `${newHue}`,
                    inline: true
                },
                {
                    name: 'Saturation',
                    value: `${newSaturation}`,
                    inline: true
                },
                {
                    name: 'Brightness',
                    value: `${newBrightness}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({
                text: `${interaction.client.user?.username}`,
                iconURL: `${interaction.client.user?.avatarURL({
                    format: 'png',
                    size: 4096
                })}`
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
