//====================================================================================CONSTANTS REQUIRED ON READY=============================================================================================
const Discord = require("discord.js");
const discord = require("discord.js");
const { PREFIX, TOKEN, embed_color } = require('./config');
const { Intents } = require('discord.js');
const { Client, Collection } = require('discord.js');
const client = new Client({ disableMentions: "everyone" }, { ws: { intents: Intents.PRIVILEGED } });
const config = require('./config.js');
client.config = config;
const bot = new Client({ disableMentions: 'everyone' });
const fs = require("fs");
const discordButtons = require('discord-buttons-plugin');
const buttonClient = new discordButtons(client);
const db = require('quick.db');
const { readdirSync } = require('fs');
const { connect } = require('mongoose');
const button = require('discord-buttons-plugin');
const fetch = require("node-fetch");
const { get } = require('axios');
const moment = require('moment');
const { MessageButton } = require('discord-buttons');
const disbut = require('discord-buttons');
const path = require("path");
const { MessageEmbed } = require("discord.js");
const { Menu, Button } = require('discord-menu-buttons');
const { MessageMenuOption, MessageMenu } = require("discord-buttons");

client.on('clickButton', async(button) => {
	console.log(button.id);
	button.defer();
	
})
const Distube = require("distube");
// We now have a client.giveawaysManager property to manage our giveaways!


bot.distube = new Distube(bot, {
  searchSongs: false,
  leaveOnFinish: false,
  leaveOnStop: false,
});

const Nuggies = require('nuggies')
require('discord-buttons')(bot)
Nuggies.handleInteractions(bot)

//============================================================================================================================================================================================================


//====================================================================================COLLECTIONS REQUIRED ON READY===========================================================================================
bot.commands = new Collection();
bot.aliases = new Collection();

//============================================================================================================================================================================================================


//============================================================================================INITIALIZING====================================================================================================
["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));


bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});

bot.on('message', async message => {

    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        
            } catch {
            prefix = PREFIX
    };
    try {
        if (message.mentions.has(bot.user.id) && !message.content.includes("@everyone") && !message.content.includes("@here")) {
			const embed = new discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(`\n**My prefix for** \`${message.guild.name}\` **it's** \`${prefix}\`. \n**Use** \`${prefix}help\` **for help.**`)
				.setFooter("©️ 𝐍𝐮𝐜𝐥𝐞𝐮𝐬 | All Rights Reserved.")
				message.channel.send(embed);
          }
          
    } catch {
        return;
    };

});

async function LoadPlayerEvents(client) {

    const { Player } = require('discord-player');

    const player = new Player(client, {
        enableLive: true,
        autoSelfDeaf: true,
        leaveOnEnd: true,
        leaveOnEndCooldown: 5000,
        leaveOnEmpty: true,
        leaveOnStop: true
    })

    client.player = player

    fs.readdir('./player-events/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`./player-events/${file}`), eventName = file.split(".")[0];
            logger.info(`Loading player event ${eventName}`);
            client.player.on(eventName, event.bind(null, client));
        });
    });

}

const { embed_play, embed_stop} =require('./config.js');

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"
  }\` | Loop: \`${queue.repeatMode
    ? queue.repeatMode == 2
      ? "All Queue"
      : "This Song"
    : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

bot.distube
	bot.distube.on("playSong", (message, queue, song) => {
		const playSongEmbed = new Discord.MessageEmbed()
		.setTitle('Started Playing')
		.setDescription(`[${song.name}](${song.url})`)
		.addField('**Views:**', song.views)
		.addField('**Duration:**', song.formattedDuration)
		.addField('**Status**', status(queue))
		.setThumbnail(song.thumbnail)
		.setColor(embed_play)
		message.channel.send(playSongEmbed)
	})
	bot.distube.on("addSong", (message, queue, song) => {
		const play = new Discord.MessageEmbed()
		.setColor(embed_play)
		.setTitle("Added to Queued")
		.setDescription(`[${song.name}](${song.url})`)
		.addField(`**Duration:**`, song.formattedDuration)
		.addField(`**Added By**`, song.user.username)
		.addField(`**Status**`, status(queue))
		.setThumbnail(song.thumbnail)
		
		message.channel.send(play)
	})
	bot.distube.on("playList", (message, queue, playlist, song) => {
	
		var request = new discord.MessageEmbed()
			.setTitle("")
		message.channel.send(`${client.emotes.play} | Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`)
	})
	bot.distube.on("addList", (message, queue, playlist) => {
		message.channel.send(`Added \`${playlist.title}\` playlist (${playlist.total_items} songs) to queue\n${status(queue)}`)
	})
	bot.distube.on("error", (message, err) => {
		message.channel.send(`An error encountered: ${err}`)
	});
	bot.distube.on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
	bot.distube.on("searchCancel", (message) => message.channel.send(`Searching canceled`))
	

bot.login(TOKEN);
