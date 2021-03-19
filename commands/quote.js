const fetch = require('node-fetch');
const config = require('../config.json');
const Discord = require('discord.js');
const { watchQuote, watchHash } = require('./helpers/quoteWatch')

// TODO: watch is not encapsulated and needs more logic. maybe break watcher component into another file.
// TODO: Create an embed so its prettier.
// TODO: add watching to embeded
// TODO: After hours tracking
// TODO: Watch list for After hours or kill.
// inside a command, event listener, etc.

module.exports = {
    name: 'quote',
    description: 'Gets quote of stock back',
    execute(message, args) {
        let ticker = args[0].toUpperCase();
        let url = config.payload_url + ticker + "&token=" + config.finnhub_token; 
        let watch = args[1] === "watch" ? true : false;
        let kill = args[1] === 'kill' ? true : false;

        if(watch && watchHash[ticker]) {
            message.reply('Symbol is already being watched');
            return;
        } 

        if(kill && watchHash[ticker]) {
            message.channel.send(`Removed $${ticker} watcher`);
            clearInterval(watchHash[ticker].watch.quoteInterval);
            delete watchHash[ticker];
            return;
        }

        async function getStockPrices() {
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }

        getStockPrices().then(response => {
            let json = response;

            if(json.o === 0) {
                message.reply('Symbol does not exist');
                return;
            }

            const movement = ((100 / json.pc * json.c) - 100).toFixed(2);
            const movementColor = movement > 0 ? '#2ECC71' : '#E74C3C';
            const embedImage = movement > 0 ? 'https://cryptoslate.com/wp-content/uploads/2021/01/doge-rocket.jpg' : 'https://i.kym-cdn.com/entries/icons/original/000/018/012/this_is_fine.jpeg';
            const embedStats = new Discord.MessageEmbed()
                .setColor(movementColor)
                .setTitle(`Stats for $${ticker}`)
                .setThumbnail(embedImage)
                .addFields(
                    { name: 'Current', value: json.c, inline: true },
                    { name: 'Movement', value: `${movement}%`, inline: true},
                    { name: 'Opening', value: json.o, inline: true},
                    { name: 'High', value: json.h, inline: true },
                    { name: 'Low', value: json.l, inline: true },
                )
                .setImage(embedImage)
                .setTimestamp()

            message.channel.send(embedStats);

            if(watch) watchQuote(message, ticker, json, url);

        });




    }

}