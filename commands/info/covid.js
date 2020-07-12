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
}

function covidReport(client, message, args, msg) {
    var json = '';
    const Http = new XMLHttpRequest();

    // get covid data
    Http.open("GET", "https://covid19api.io/api/v1/AllReports");
    Http.send();
    Http.onreadystatechange = function() {

        json = Http.responseText;
        
        // check status of request
        if (this.readyState == 4 && this.status == 200) {
            try {
                var generateTable = new Promise((resolve, reject) => {
                    // parse report data
                    const data = JSON.parse(json);
                    const date = new Date();

                    const table = new ascii()
                        .setTitle(`Covid-19 Report as of ${formatDate(date)} ${formatTime(date)} (CST)`)
                        .setHeading('#', 'Country', 'Cases', 'Deaths', 'Recovered');

                    const newData = data.reports;

                    cases = newData[0]["table"][0].sort((countryA, countryB) => {
                        return parseInt(countryB["TotalCases"].replace(/,/g,"")) - parseInt(countryA["TotalCases"].replace(/,/g,""));
                    });
                    
                    // add total row
                    table.addRow('', cases[1]['Country'], cases[1]['TotalCases'], cases[1]['TotalDeaths'], cases[1]['TotalRecovered']);

                    // add next top 10 countries
                    for(var i = 2; i < 12; i = i + 1) {
                        table.addRow(i - 1, cases[i]['Country'], cases[i]['TotalCases'], cases[i]['TotalDeaths'], cases[i]['TotalRecovered']);
                    }
                    resolve();
                
                    const embed = new MessageEmbed()
                        .setDescription(`\`\`\`${table.toString()}\`\`\``)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTimestamp();
                    message.channel.send(embed);
                    });

                    generateTable.then(() => {
                        msg.delete();
                    });
              
            } catch(err) {
                console.error(err.message);
                message.channel.send("An error has occured!");
            }
        }
    }
}