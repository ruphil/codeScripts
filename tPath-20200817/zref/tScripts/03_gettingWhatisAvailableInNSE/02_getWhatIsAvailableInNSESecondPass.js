const puppeteer = require('puppeteer')
const fs = require('fs')

var folderPath = "./NSEAvailableDates/"

var CSVNotAvailPathFirstPass = folderPath + "NSENotAvailFirstPass.csv"
var CSVAvailPathSecondPass = folderPath + "NSEAvailSecondPass.csv"
var CSVNotAvailPathSecondPass = folderPath + "NSENotAvailSecondPass.csv"

var NSENotAvailCSVFirstPass = fs.readFileSync(CSVNotAvailPathFirstPass, 'utf-8');
var NSENotAvailCSVFirstPassArray = NSENotAvailCSVFirstPass.split("\n");
NSENotAvailCSVFirstPassArray.pop();

startMakingNSECSV(NSENotAvailCSVFirstPassArray)

async function startMakingNSECSV(NSENotAvailCSVFirstPassArray) {
	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })

    const page = await browser.newPage()

    for(var i = 0; i < NSENotAvailCSVFirstPassArray.length; i++){
        // console.log(NSENotAvailCSVFirstPassArray[i])
        dateParts = NSENotAvailCSVFirstPassArray[i].split('-');
        reqDate = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12);

        var dateStr = reqDate.getDate().toString().padStart(2, '0') + "-" + (reqDate.getMonth() + 1).toString().padStart(2, '0') + "-" + reqDate.getFullYear().toString();
        var gdateStr = reqDate.getFullYear().toString() + "-" + (reqDate.getMonth() + 1).toString().padStart(2, '0') + "-" + reqDate.getDate().toString().padStart(2, '0');
        
        var url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=" + dateStr + "&section=EQ"
        var selector = "body > table > tbody > tr > td > a:nth-child(1)"
        
        await page.goto(url)
        await page.waitFor(5000)

        try{
            // await page.waitFor(selector)
            let element = await page.$(selector)
            var fileName = await page.evaluate(el => el.textContent, element)
            var csvRow = gdateStr + ", " + fileName + "\n"
            fs.appendFileSync(CSVAvailPathSecondPass, csvRow)
            console.log(csvRow)
        } catch (e) {
            var csvRow = gdateStr + "\n"
            fs.appendFileSync(CSVNotAvailPathSecondPass, csvRow)
            continue
        }
    }
    
    browser.close();
}