const Discord = require('discord.js');

module.exports = async (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId == "dbot-linkspanel") {
            if (interaction.values == "top.gg-linkspanel") {
                interaction.deferUpdate();

                const row2 = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId('dbot-linkspanel')
                            .setPlaceholder('ββNothing selected')
                            .addOptions([
                                {
                                    label: `Support server`,
                                    description: `Join the suppport server`,
                                    emoji: "β",
                                    value: "support-linkspanel",
                                },
                                {
                                    label: `Invite Dbot`,
                                    description: `Invite Dbot to your server`,
                                    emoji: "π¨",
                                    value: "invite-linkspanel",
                                },
                                {
                                    label: `Invite Dbot 2`,
                                    description: `Invite Dbot 2 to your server`,
                                    emoji: "π",
                                    value: "invite2-linkspanel",
                                },
                                {
                                    label: `Community Server`,
                                    description: `Join the community server!`,
                                    emoji: "π",
                                    value: "community-linkspanel",
                                },
                                {
                                    label: `Top.gg`,
                                    description: `Show the top.gg link`,
                                    emoji: "π",
                                    value: "top.gg-linkspanel",
                                },
                            ]),
                    );

                let row = new Discord.MessageActionRow()
                    .addComponents(

                        new Discord.MessageButton()
                            .setLabel("Vote Now")
                            .setURL("https://top.gg/bot/798144456528363550/vote")
                            .setStyle("LINK"),
                    );

                client.embed({
                    title: `πγ»Bot Vote`,
                    desc: `Vote for Dbot on top.gg`,
                    image: "https://cdn.discordapp.com/attachments/843487478881976381/874694192755007509/dbot_banner_vote.jpg",
                    url: "https://top.gg/bot/798144456528363550/vote",
                    components: [row2, row],
                    type: 'edit'
                }, interaction.message)
            }
        }
    }).setMaxListeners(0);
}

// Β© Dotwood Media | All rights reserved