import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get more information about a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('user to inspect').setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.get('user');

        // user properties
        const roles = user.member._roles.map((i) => `<@&${i}>`).join(', ') || 'None';
        const joined = Intl.DateTimeFormat('en-US').format(user.member.guild.joinedTimestamp);
        const created = Intl.DateTimeFormat('en-US').format(user.member.user.createdAt);
        const displayName = user.member.nickname || user.member.user.username;

        // create embed
        const embed = new EmbedBuilder()
            .setTitle(`${user.member.user.username} #${user.member.user.discriminator}`)
            .setColor(user.member.displayColor)
            .addFields(
                {
                    name: 'Member Information',
                    value: `**\\> Display name:** ${displayName}\n**\\> Joined on:** ${joined}\n**\\> Roles:** ${roles}\n**\\> Balance:** ${1}`,
                    inline: true
                },
                {
                    name: 'User Information',
                    value: `**\\> Status:** ${
                        // user.member.presence.status.charAt(0).toUpperCase() +
                        // user.member.presence.status.slice(1)
                        1
                    }\n**\\> Username:** ${user.member.user.tag}\n**\\> ID:** ${
                        user.member.user.id
                    }\n**\\> Created on:** ${created}`,
                    inline: true
                }
            )
            .setThumbnail(user.member.user.displayAvatarURL({ size: 4096 }))
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        // send embed
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
        return;
    }
};
