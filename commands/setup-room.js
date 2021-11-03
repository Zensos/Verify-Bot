const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setup",
    description: "☢ สร้างห้องสำหรับ Verify",
    options: [
        {
            name: "roomname",
            description: "ลิ้งซองอั่งเป่า",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    /**
     *
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").Message} interaction
     */
    async execute(client, interaction) {

        if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({
            embeds : [
                new Discord.MessageEmbed()
                .setDescription('❌ คุณไม่มี PERMISSIONS ADMINISTRATOR')
                .setColor(process.env.FAIL_COLOR)
            ]
        })

        let roomname = interaction.options.getString('roomname')

        let data = await db.get(interaction.guild.id);

        if(!data) {
            let res = await interaction.guild.channels.create(roomname, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        de: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    }
                ],
            })
            db.set(res.guild.id , { info : res.guild , creator : interaction.user.id , raw_channel : res.id } )
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`☢ ได้ทำการสร้าง DATABASE ${interaction.guild.name}`)
                    .setDescription([
                        '🚧 `DB INFO`: ' + interaction.guild.id,
                        '👤 `Creator`: ' + `<@${interaction.user.id}>`
                    ].join('\n'))
                    .setFooter('Copyright © 2021' , interaction.user.displayAvatarURL())
                    .setColor(process.env.MAIN_COLOR)
                    .setThumbnail(interaction.guild.iconURL())
                ]
            })
        } else if(data) {
            let msg = interaction.reply({
                embeds : [
                    new Discord.MessageEmbed()
                    .setTitle('❌ มี database ของ Guild นี้อยู่แล้ว')
                    .setDescription([
                        '🚧 `DB INFO`: ' + data.info.id,
                        '👤 `Creator`: ' + `<@${data.creator}>`
                    ].join('\n'))
                    .setFooter('Copyright © 2021' , interaction.user.displayAvatarURL())
                    .setColor(process.env.MAIN_COLOR)
                    .setThumbnail(interaction.guild.iconURL())
                ],
            })
        }
    }
}