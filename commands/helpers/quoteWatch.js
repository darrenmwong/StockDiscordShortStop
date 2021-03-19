const watchHash = new Map();

class QuoteInterval {
    constructor(args) {
        this.quoteInterval = setInterval( () => { console.log(args) }, 10000);
        this.args = args ? args : null;
    }
};

const watchQuote = (message, args, ticker) => {
   message.reply('Watching ' + ticker);
   // find and see if theres a ticker inside the hash
   let watcher = new QuoteInterval(ticker);
   watchHash.set(ticker, watcher);
}


module.exports = { watchQuote, watchHash };