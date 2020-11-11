const puppeteer = require('puppeteer');
const fs = require('fs');

startMakingEMailsCSV();

async function startMakingEMailsCSV() {
	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })

    const page = await browser.newPage();
    const url = 'http://cbseaff.nic.in/cbse_aff/schdir_Report/userview.aspx';

    await page.goto(url);
    await page.waitForTimeout(500);

    let stateRadioSelector = '#optlist_2';
    let stateOptionSelector = '#ddlitem';
    let searchButton = '#search';
    let nextButton = '#Button1';

    await page.waitForTimeout(stateRadioSelector);
    await page.waitForTimeout(1000);
    await page.click(stateRadioSelector);
    await page.waitForTimeout(2000);

    await page.waitForTimeout(stateOptionSelector);
    await page.waitForTimeout(3000);
    const selectElem = await page.$(stateOptionSelector);
    await selectElem.type('KARNATAKA');
    await page.waitForTimeout(2000);

    await page.click(searchButton);
    await page.waitForTimeout(1000);

    let csvFile = '../emailIDs.csv';
    let csvRow = 'Index' + ',' + 'School' + ',' + 'Address' + ',' + 'EMail' + '\n';
    fs.appendFileSync(csvFile, csvRow);

    while(true){
        
        for (let i = 2; i <=26; i++){
            let indexSelector = `#T1 > tbody > tr > td > table:nth-child(${i}) > tbody > tr > td.repItem`;
            let schoolNameSelector = `#T1 > tbody > tr > td > table:nth-child(${i}) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td`;
            let addressSelector = `#T1 > tbody > tr > td > table:nth-child(${i}) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td`;
            let mailIDSelector = `#T1 > tbody > tr > td > table:nth-child(${i}) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(3) > td`;

            let indexEl = await page.$(indexSelector);
            let schoolEl = await page.$(schoolNameSelector);
            let addressEl = await page.$(addressSelector);
            let mailEl = await page.$(mailIDSelector);

            let indexVal = await page.evaluate((el) => el.textContent, indexEl);
            let schoolVal = await page.evaluate((el) => el.textContent, schoolEl);
            let addressVal = await page.evaluate((el) => el.textContent, addressEl);
            let mailVal = await page.evaluate((el) => el.textContent, mailEl);

            indexVal = indexVal.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s/g, '');
            schoolVal = schoolVal.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s/g, '').replace('Name:', '').replace(/[^a-z]/gi,'');
            addressVal = addressVal.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s/g, '').replace('Address:', '').replace(/[^a-z]/gi,'');
            mailVal = mailVal.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s/g, '').split('Email:').pop().split('Website:')[0];

            let csvRow = indexVal + ',' + schoolVal + ',' + addressVal + ',' + mailVal + '\n';
            fs.appendFileSync(csvFile, csvRow);
        }
        
        await page.waitForTimeout(3000);
        await page.click(nextButton);
        await page.waitForTimeout(2000);
    }
    

}