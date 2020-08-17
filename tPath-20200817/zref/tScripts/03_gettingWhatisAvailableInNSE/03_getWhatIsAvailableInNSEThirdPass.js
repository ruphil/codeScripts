const puppeteer = require('puppeteer');
const fs = require('fs');

var folderPath = "./NSEAvailableDates/";

var CSVNotAvailPathSecondPass = folderPath + "NSENotAvailSecondPass.csv"
var CSVAvailPathThirdPass = folderPath + "NSEAvailThirdPass.csv"
var CSVNotAvailPathThirdPass = folderPath + "NSENotAvailThirdPass.csv"

var NSENotAvailCSVSecondPass = fs.readFileSync(CSVNotAvailPathSecondPass, 'utf-8');
var NSENotAvailCSVSecondPassArray = NSENotAvailCSVSecondPass.split("\n");
NSENotAvailCSVSecondPassArray.pop();

startMakingNSECSV(NSENotAvailCSVSecondPassArray)

async function startMakingNSECSV(NSENotAvailCSVSecondPassArray) {
	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })

    const page = await browser.newPage()

    for(var i = 0; i < NSENotAvailCSVSecondPassArray.length; i++){
        // console.log(NSENotAvailCSVSecondPassArray[i])
        dateParts = NSENotAvailCSVSecondPassArray[i].split('-');
        reqDate = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12);

        var dateStr = reqDate.getDate().toString().padStart(2, '0') + "-" + (reqDate.getMonth() + 1).toString().padStart(2, '0') + "-" + reqDate.getFullYear().toString();
        var gdateStr = reqDate.getFullYear().toString() + "-" + (reqDate.getMonth() + 1).toString().padStart(2, '0') + "-" + reqDate.getDate().toString().padStart(2, '0');
        
        var url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=" + dateStr + "&section=EQ"
        var selector = "body > table > tbody > tr > td > a:nth-child(1)";
        
        await page.goto(url);
        await page.waitFor(10000);

        try{
            // await page.waitFor(selector)
            let element = await page.$(selector)
            var fileName = await page.evaluate(el => el.textContent, element)
            var csvRow = gdateStr + ", " + fileName + "\n"
            fs.appendFileSync(CSVAvailPathThirdPass, csvRow)
            console.log(csvRow)
        } catch (e) {
            var csvRow = gdateStr + "\n"
            fs.appendFileSync(CSVNotAvailPathThirdPass, csvRow)
            continue
        }
    }

    browser.close();
}