const Discord = require('discord.js');
const Captcha = require("@haileybot/captcha-generator");

const reactionSchema = require("../../database/models/reactionRoles");
const banSchema = require("../../database/models/userBans");
const verify = require("../../database/models/verify");

module.exports = async (client, interaction) => {
    // Commands
    if (interaction.isCommand() || interaction.isContextMenu()) {
        await interaction.deferReply({ fetchReply: true });

        banSchema.findOne({ User: interaction.user.id }, async (err, data) => {
            if (data) {
                return client.errNormal({
                    error: "You have been banned by the developers of this bot",
                    type: 'ephemeraledit'
                }, interaction);
            }
            else {
                const cmd = client.commands.get(interaction.commandName);
                if (interaction.options._subcommand !== null && interaction.options.getSubcommand() == "help") {
                    const commands = interaction.client.commands.filter(x => x.data.name == interaction.commandName).map((x) => x.data.options.map((c) => '`' + c.name + '` - ' + c.description).join("\n"));

                    return client.embed({
                        title: `❓・Help panel`,
                        desc: `Get help with the commands in \`${interaction.commandName}\` \n\n${commands}`,
                        type: 'editreply'
                    }, interaction)
                }

                cmd.run(client, interaction, interaction.options._hoistedOptions).catch(err => {
                    client.emit("errorCreate", err, interaction.commandName, interaction)
                })
            }
        })
    }

    // Verify system
    if (interaction.isButton() && interaction.customId == "dbot_verify") {
        const data = await verify.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
        if (data) {
            let captcha = new Captcha();

            try {
                var image = new Discord.MessageAttachment(captcha.JPEGStream, "captcha.jpeg");

                interaction.reply({ files: [image], fetchReply: true }).then(function (msg) {
                    const filter = s => s.author.id == interaction.user.id;

                    interaction.channel.awaitMessages({ filter, max: 1 }).then(response => {
                        if (response.first().content === captcha.value) {
                            response.first().delete();
                            msg.delete();

                            client.succNormal({
                                text: "You have been successfully verified!"
                            }, interaction.user).catch(error => { })

                            var verifyUser = interaction.guild.members.cache.get(interaction.user.id);
                            verifyUser.roles.add(data.Role);
                        }
                        else {
                            response.first().delete();
                            msg.delete();

                            client.errNormal({
                                error: "You have answered the captcha incorrectly!",
                                type: 'editreply'
                            }, interaction).then(msgError => {
                                setTimeout(() => {
                                    msgError.delete();
                                }, 2000)
                            })
                        }
                    })
                })
            }
            catch (error) {
                throw error;
            }
        }
        else {
            client.errNormal({
                error: "Verify is disabled in this server! Or you are using the wrong channel!",
                type: 'ephemeral'
            }, interaction);
        }
    }

    // Reaction roles button
    if (interaction.isButton()) {
        var buttonID = interaction.customId.split("-");

        if (buttonID[0] == "reaction_button") {
            reactionSchema.findOne({ Message: interaction.message.id }, async (err, data) => {
                if (!data) return;

                const [roleid] = data.Roles[buttonID[1]];

                if (interaction.member.roles.cache.get(roleid)) {
                    interaction.guild.members.cache.get(interaction.user.id).roles.remove(roleid).catch(error => { })

                    interaction.reply({ content: `<@&${roleid}> was removed!`, ephemeral: true });
                }
                else {
                    interaction.guild.members.cache.get(interaction.user.id).roles.add(roleid).catch(error => { })

                    interaction.reply({ content: `<@&${roleid}> was added!`, ephemeral: true });
                }
            })
        }
    }

    // Reaction roles select
    if (interaction.isSelectMenu()) {
        if (interaction.customId == "reaction_select") {
            reactionSchema.findOne(
                { Message: interaction.message.id },
                async (err, data) => {
                    if (!data) return;

                    let roles = "";

                    for (let i = 0; i < interaction.values.length; i++) {
                        const [roleid] = data.Roles[interaction.values[i]];

                        roles += `<@&${roleid}> `;

                        if (interaction.member.roles.cache.get(roleid)) {
                            interaction.guild.members.cache
                                .get(interaction.user.id)
                                .roles.remove(roleid)
                                .catch((error) => { });
                        } else {
                            interaction.guild.members.cache
                                .get(interaction.user.id)
                                .roles.add(roleid)
                                .catch((error) => { });
                        }

                        if ((i + 1) === interaction.values.length) {
                            interaction.reply({
                                content: `I have updated the following roles for you: ${roles}`,
                                ephemeral: true,
                            });
                        }
                    }
                }
            );
        }
    }

    // Tickets
    if (interaction.customId == "dbot_openticket") {
        return require(`${process.cwd()}/src/commands/tickets/create.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_closeticket") {
        return require(`${process.cwd()}/src/commands/tickets/close.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_claimTicket") {
        return require(`${process.cwd()}/src/commands/tickets/claim.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_transcriptTicket") {
        return require(`${process.cwd()}/src/commands/tickets/transcript.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_openTicket") {
        return require(`${process.cwd()}/src/commands/tickets/open.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_deleteTicket") {
        return require(`${process.cwd()}/src/commands/tickets/delete.js`)(client, interaction);
    }

    if (interaction.customId == "dbot_noticeTicket") {
        return require(`${process.cwd()}/src/commands/tickets/notice.js`)(client, interaction);
    }
}

// © Dotwood Media | All rights reserved