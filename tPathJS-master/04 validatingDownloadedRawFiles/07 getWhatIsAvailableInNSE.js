const puppeteer = require('puppeteer')
const fs = require('fs')

var startDate = new Date(2013, 11, 17)
var endDate = new Date(2020, 01, 29)

// var startDate = new Date(2001, 00, 01)
// var endDate = new Date(2001, 00, 10)

startMakingNSECSV()

async function startMakingNSECSV() {
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
            await page.waitFor(2000)

            try{
                // await page.waitFor(selector)
                let element = await page.$(selector)
                var fileName = await page.evaluate(el => el.textContent, element)
                var csvRow = gdateStr + ", " + fileName + "\n"
                fs.appendFileSync('D:/tOut/NSE.csv', csvRow)
                console.log(csvRow)
            } catch (e) {
                startDate.setDate(startDate.getDate() + 1)
                continue
            }
        }
        startDate.setDate(startDate.getDate() + 1)

        if (endDate.getTime() < startDate.getTime()){
            lastDateReached = true
            browser.close()
        }
    }
}