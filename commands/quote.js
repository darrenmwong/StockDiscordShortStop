const fetch = require('node-fetch');
const config = require('../config.json');

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
                message.reply('Current Price: ' + json.c + '. Open Price: ' + json.o);
            } else {
                console.log('error', response);
            }
        }
        getStockPrices();
    }
}