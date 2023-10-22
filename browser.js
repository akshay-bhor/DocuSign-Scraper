const puppeteer = require('puppeteer');

module.exports = async () => {
  browser = await puppeteer.launch({ 
    headless: false, 
    executablePath: process.env.EXECUTABLE_PATH,
    args: [`--user-data-dir=${process.env.USER_DATA_DIR}`],
    protocolTimeout: 600000
  });
}