const ascii = require('ascii-table');
const { MessageEmbed } = require('discord.js');
const { formatDate, formatTime } = require('../../functions');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = {
    name: 'covid-report',
    aliases: ['covid', 'covid-19', 'report'],
    category: 'info',
    description: 'Displays Covid-19 statistics',
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Generating Covid-19 Report...`);
        covidReport(client, message, args, msg);
    }
};

function covidReport(client, message, args, msg) {
    var json = '';
    const Http = new XMLHttpRequest();

    // get covid data
    Http.open('GET', 'https://api.covid19api.com/summary');
    Http.send();
    Http.onreadystatechange = function () {
        var json = Http.responseText;

        // check status of request
        if (this.readyState == 4 && this.status == 200) {
            try {
                var generateTable = new Promise((resolve, reject) => {
                    // parse report data
                    const data = JSON.parse(json);
                    const date = new Date();

                    const table = new ascii()
                        .setTitle(
                            `Covid-19 Report as of ${formatDate(
                                date
                            )} ${formatTime(date)} (CST)`
                        )
                        .setHeading(
                            '#',
                            'Country',
                            'Cases',
                            'Deaths',
                            'Recovered'
                        );

                    cases = data.Countries.sort((countryA, countryB) => {
                        return (
                            parseInt(countryB['TotalConfirmed']) -
                            parseInt(countryA['TotalConfirmed'])
                        );
                    });

                    total = data.Global;

                    // add total row
                    table.addRow(
                        '',
                        'Total',
                        total['TotalConfirmed'],
                        total['TotalDeaths'],
                        total['TotalRecovered']
                    );

                    // add next top 10 countries
                    for (var i = 0; i < 10; i = i + 1) {
                        table.addRow(
                            i + 1,
                            cases[i]['Country'].length < 16
                                ? cases[i]['Country']
                                : cases[i]['Country'].substring(0, 16) + '...',
                            cases[i]['TotalConfirmed'],
                            cases[i]['TotalDeaths'],
                            cases[i]['TotalRecovered']
                        );
                    }

                    var embed = new MessageEmbed()
                        .setDescription(`\`\`\`${table.toString()}\`\`\``)
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )
                        .setTimestamp();

                    resolve(embed);
                });

                generateTable.then((embed) => {
                    msg.edit(embed);
                });
            } catch (err) {
                console.error(err.message);
                message.channel.send('An error has occured!');
            }
        }
    };
}
