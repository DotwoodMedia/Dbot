const Discord = require('discord.js');

module.exports = async (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId == "dbot-helppanel") {
            if (interaction.values == "changelogs-dbothelp") {
                interaction.deferUpdate();

                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId('dbot-helppanel')
                            .setPlaceholder('โโNothing selected')
                            .addOptions([
                                {
                                    label: `Commands`,
                                    description: `Show the commands of Dbot!`,
                                    emoji: "๐ป",
                                    value: "commands-dbothelp",
                                },
                                {
                                    label: `Invite`,
                                    description: `Invite Dbot to your server`,
                                    emoji: "๐จ",
                                    value: "invite-dbothelp",
                                },
                                {
                                    label: `Support server`,
                                    description: `Join the suppport server`,
                                    emoji: "โ",
                                    value: "support-dbothelp",
                                },
                                {
                                    label: `Changelogs`,
                                    description: `Show the bot changelogs`,
                                    emoji: "๐",
                                    value: "changelogs-dbothelp",
                                },
                            ]),
                    );

                client.embed({
                    title: "๐ใปChangelogs",
                    desc: `_____`,
                    thumbnail: client.user.avatarURL({ size: 1024 }),
                    fields: [
           {
                name: "๐ขโAlert!",
                value: 'After more than 1 year we decided to stop Dbot on April 15th, for more information go to [this server](https://discord.gg/techpoint)',
                inline: false,
            },
                    ],
                    components: [row],
                    type: 'edit'
                }, interaction.message)
            }
        }
    }).setMaxListeners(0);
}

// ยฉ Dotwood Media | All rights reserved