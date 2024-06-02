if(process.env.CHECKER === 'production') {
    const { join } = require('path');
    /**
    * @type {import("puppeteer").Configuration}
    */
    module.exports = {cacheDirectory: join(__dirname, '.cache', 'puppeteer')};
} 