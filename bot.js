const Discord = require("discord.js");
const db = require("quick.db");
const client = new Discord.Client();
const { CanvasSenpai } = require("canvas-senpai")
const { PREFIX } = require("./config.js")
const canva = new CanvasSenpai();
const fs = require('fs');
client.commands = new Discord.Collection();
 
client.once("ready", () => {
  console.log("Ready!");
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'setwelcome') {
	client.commands.get('setwelcome').execute(message, args);
	}
});

 
client.on('guildMemberAdd', async member => {
    const channel = await db.get(`welcome_${member.guild.id}`)
    if (!channel) return;
 
    let data = await canva.welcome(member, { link: "", })
 
    const attachment = new Discord.MessageAttachment(
      data,
      "welcome-image.png"
    );
 
client.channels.cache.get(channel).send("**__WELCOME TO THE SERVER__** " + member.user.username, attachment)
});

client.on("message", async message => {
  if (message.content === "join") {
    client.emit("guildMemberAdd", message.member)
  }
})

client.login("NzQ1MjA4MTc4OTvbjkhUw5_6fxOIhDYdhZDGXfhHc");