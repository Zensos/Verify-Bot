const Discord = require('discord.js');

module.exports = {
    name: "toggle-verify",
    description: "🔒 Toggle Verify",
    options: [],
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

        let info = new Discord.MessageEmbed()
        .setDescription(`🔒 ได้ทำการปรับค่า VERIFY เป็น \`${client.room ? client.room = false : client.room = true}\``)
        .setColor(client.room ? process.env.MAIN_COLOR : process.env.FAIL_COLOR)

        console.log(client.room)
    
        interaction.reply({embeds : [info]})
    }
}