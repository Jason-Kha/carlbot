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
            // SelectMenu
        } else if (interaction.isSelectMenu) {
            switch (interaction.customId) {
                case 'food_options': {
                    await interaction.reply(`Food selected: ${interaction.values}`);
                }
                case 'drink_options': {
                    await interaction.reply(`Drink selected: ${interaction.values}`);
                }
            }
        }
    }
};
