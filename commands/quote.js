const fetch = require('node-fetch');
const config = require('../config.json');

let stockHash = new Map();

// Need last ticker priced so if we quote it doesnt set values. Maybe a hashmap or we can store in a db.

module.exports = {
    name: 'quote',
    description: 'Gets quote of stock back',
    execute(message, args) {
        let ticker = args[0].toUpperCase();
        let url = config.payload_url + ticker + "&token=" + config.finnhub_token; 

        async function getStockPrices() {
            const response = await fetch(url);
            if(response.ok) {
                let json = await response.json();
                if(stockHash.has(ticker)) {
                    message.reply('Current Price: ' + json.c + '. Open Price: ' + json.o);
                    message.reply('Last value since quote = ' + stockHash.get(ticker) + '. Difference ' + (json.c - stockHash.get(ticker)));
                    stockHash.set(ticker, json.c);
                } else {
                    message.reply('Current Price: ' + json.c + '. Open Price: ' + json.o);
                    stockHash.set(ticker, json.c);
                }
            } else {
                console.log('error', response);
            }
        }
        getStockPrices();
    }
}