require('dotenv').config()
const { Client, Intents, Collection, MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

(async () => {
    client.commands = new Collection();

    client.room = false;

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }

    function parseCommand() {
        let commands = []
        for (let obj of client.commands) {
            commands.push(obj[1])
        }
        return commands
    }

    client.on('ready', () => {
        console.log('[BOT]: ' + client.user.username, 'Is Online!');
        client.guilds.cache.forEach(async guild => {
            await guild.commands.set(parseCommand())
        })
    })

    client.on("guildCreate", async guild => {
        await guild.commands.set(parseCommand())
    })

    client.on("guildDelete", async guild => {
        await guild.commands.delete();
    })

    client.on('guildMemberAdd' , (member) => {
        if(member.user.bot && client.toggle) return member.ban();
    })

    client.on('messageCreate' , async (message) => {
        let data = await db.get(message.guild.id);
        if(!message.author.bot && message.channel.id != data.raw_channel && !client.room) return;
        message.delete()
        if(message.content == process.env.VERIFY_MESSAGES && !message.member.roles.cache.find(r => r.id === process.env.ROLE_ID)) {
            let roles = message.guild.roles.cache.get(process.env.ROLE_ID)
            message.member.roles.add(roles)
        }
    })

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            if (!client.commands.has(interaction.commandName)) return;
            try {
                await client.commands.get(interaction.commandName).execute(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
})()

client.login(process.env.TOKEN)

//พี่ขอเครดิตนะน้องพี่ไม่อยากให้เอาไปขาย
