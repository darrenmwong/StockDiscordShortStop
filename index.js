const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const fetch = require('node-fetch');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Bot Ready');
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('Not a real command or error');
    }

    // let ticker = args[1].toUpperCase();
    // let url = config.payload_url + ticker + "&token=" + config.finnhub_token; 

    // async function getStockPrices() {
    //     const response = await fetch(url);
    //     if(response.ok) {
    //         let json = await response.json();
    //         message.reply('Current Price: ' + json.c + '. Open Price: ' + json.o);
    //     } else {
    //         console.log('error', response);
    //     }
    // }
    // getStockPrices();

});

client.login(config.token);
