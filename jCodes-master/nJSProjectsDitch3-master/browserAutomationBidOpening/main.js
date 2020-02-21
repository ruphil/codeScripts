const puppeteer = require('puppeteer');
const sleep = require('thread-sleep');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    
    const page = await browser.newPage();
    await page.goto('https://sso.gem.gov.in/ARXSSO/oauth/login');

    await page.waitFor('#hd > div.g3fh > div > section:nth-child(3) > section > div > div > div.col-md-10.col-xs-12 > ul > li:nth-child(1) > a');
    console.log("Logged In");

    await page.waitFor('#collapseTwo > div > div > div > div.col-md-12 > label');

    sleep(2000);
    console.log('Reached the Section');

    await page.click('#sellers_form > div > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > a');




})();
