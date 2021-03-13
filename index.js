const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const fetch = require('node-fetch');

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    console.log(args);

    let ticker = args[1].toUpperCase();
    let url = config.payload_url + ticker + "&token=" + config.finnhub_token; 


    async function getStockPrices() {
        const response = await fetch(url);
        if(response.ok) {
            let json = await response.json();
            message.reply('Current Price: ' + json.c + '. Open Price: ' + json.o);
        } else {
            console.log('error', response);
        }
    }
    getStockPrices();

});

client.login(config.token);
