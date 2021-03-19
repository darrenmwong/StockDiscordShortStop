const fetch = require('node-fetch');
const config = require('../config.json');
const Discord = require('discord.js');
const { watchQuote, watchHash } = require('./helpers/quoteWatch')

let stockHash = new Map();

// Need last ticker priced so if we quote it doesnt set values. Maybe a hashmap or we can store in a db.
// TODO: If args has watch, we need to check if the symbol is returning true so we can add in a hash map and watch.
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

        if(watch && watchHash.get(ticker)) {
            message.reply('Symbol is already being watched');
            return;
        } 

        if(kill && watchHash.get(ticker)) {
            message.channel.send(`Removed $${ticker} watcher`);
            clearInterval(watchHash.get(ticker).quoteInterval);
            watchHash.delete(ticker);
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

            if(stockHash.has(ticker)) {
                if((stockHash.get(ticker) - json.c) >= 10 ) {
                    message.reply('LOSS. ' + stockHash.get(ticker) + '. Difference: $' + (json.c - stockHash.get(ticker)));
                }
                if((stockHash.get(ticker) - json.c) <= -10 ) {
                    message.reply('GAIN. ' + 'Difference: +$' + (json.c - stockHash.get(ticker)));
                }
                stockHash.set(ticker, json.c);
            } else {
                message.channel.send(embedStats);
                stockHash.set(ticker, json.c);
            }

            if(watch) watchQuote(message, args, ticker);

        });




    }

}