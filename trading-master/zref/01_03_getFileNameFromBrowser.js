const puppeteer = require('puppeteer')

getFileName("19-03-2003");

async function getFileName(date) {
	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })
    const page = await browser.newPage()
    
    var url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=" + date + "&section=EQ"
    var selector = "body > table > tbody > tr > td > a:nth-child(1)"
    await page.goto(url)

    await page.waitFor(selector)
    let element = await page.$(selector)
    let fileName = await page.evaluate(el => el.textContent, element)
    console.log(fileName)
    
    await browser.close();

}

// Main Page
    // await page.goto('https://www1.nseindia.com/products/content/equities/equities/archieve_eq.htm');