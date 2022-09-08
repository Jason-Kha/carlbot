export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
        console.log(
            `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction`
        );

        // ChatInputCommand
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.default.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
            return;
            // SelectMenu
        } else if (interaction.isSelectMenu) {
            const customId = interaction.customId.split('_')[0];
            const command = client.commands.get(customId);
            if (!command) return;

            try {
                await command.default.response(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
            return;
        }
    }
};
