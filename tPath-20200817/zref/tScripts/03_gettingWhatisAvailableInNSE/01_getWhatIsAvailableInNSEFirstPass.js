const puppeteer = require('puppeteer')
const fs = require('fs')

// var folderPath = "D:/tData/"

var folderPath = "./NSEAvailableDates/"

var CSVAvailPathFirstPass = folderPath + "NSEAvailFirstPass.csv"
var CSVNotAvailPathFirstPass = folderPath + "NSENotAvailFirstPass.csv"

var initialDate = new Date(2001, 00, 01, 12)
var finalDate = new Date(2020, 01, 29, 12)

var lastDate
try {
    var NSEAvailCSV = fs.readFileSync(CSVAvailPathFirstPass, 'utf-8');
    var NSEAvailCSVArray = NSEAvailCSV.split("\n");
    lastDateParts = NSEAvailCSVArray[NSEAvailCSVArray.length - 2].split(',')[0].split('-');
    // console.log(NSEAvailCSVArray)
    lastDate = new Date(lastDateParts[0], parseInt(lastDateParts[1]) - 1, lastDateParts[2], 12);
    lastDate.setDate(lastDate.getDate() + 1);

    // var NSENotAvailCSV = fs.readFileSync(CSVNotAvailPathFirstPass, 'utf-8');
} catch (e) {}

var startDate
if (lastDate == null){
    startDate = initialDate
} else {
    startDate = lastDate
}
console.log(startDate);

startMakingNSECSV(startDate)

async function startMakingNSECSV(startDate) {
	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })

    const page = await browser.newPage()

    var lastDateReached = false
    while (!lastDateReached){
        var isWeekend = (startDate.getDay() === 6) || (startDate.getDay() === 0)
        if(!isWeekend){
            var dateStr = startDate.getDate().toString().padStart(2, '0') + "-" + (startDate.getMonth() + 1).toString().padStart(2, '0') + "-" + startDate.getFullYear().toString()
            var gdateStr = startDate.getFullYear().toString() + "-" + (startDate.getMonth() + 1).toString().padStart(2, '0') + "-" + startDate.getDate().toString().padStart(2, '0')
            
            var url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=" + dateStr + "&section=EQ"
            var selector = "body > table > tbody > tr > td > a:nth-child(1)"
            
            await page.goto(url)
            await page.waitFor(1000)

            try{
                // await page.waitFor(selector)
                let element = await page.$(selector)
                var fileName = await page.evaluate(el => el.textContent, element)
                var csvRow = gdateStr + ", " + fileName + "\n"
                fs.appendFileSync(CSVAvailPathFirstPass, csvRow)
                console.log(csvRow)
            } catch (e) {
                var csvRow = gdateStr + "\n"
                fs.appendFileSync(CSVNotAvailPathFirstPass, csvRow)
                startDate.setDate(startDate.getDate() + 1)
                continue
            }
        }
        startDate.setDate(startDate.getDate() + 1)

        if (finalDate.getTime() < startDate.getTime()){
            lastDateReached = true
            browser.close()
        }
    }
}