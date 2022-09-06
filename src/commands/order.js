import { SlashCommandBuilder } from 'discord.js';

const orderCommand = new SlashCommandBuilder()
    .setName('order')
    .setDescription('Order your favorite Meal');
// .addStringOption((option) =>
//     option
//         .setName('food')
//         .setDescription('Select your favorite food')
//         .setRequired(true)
//         .setChoices(
//             {
//                 name: 'cake',
//                 value: 'cake'
//             },
//             {
//                 name: 'handburger',
//                 value: 'hand burg'
//             }
//         )
// )
// .addStringOption((option) =>
//     option
//         .setName('drink')
//         .setDescription('Select your favorite drink')
//         .setRequired(true)
//         .setChoices(
//             {
//                 name: 'water',
//                 value: 'water'
//             },
//             {
//                 name: 'cola',
//                 value: 'cola'
//             }
//         )
// );

export default orderCommand.toJSON();
