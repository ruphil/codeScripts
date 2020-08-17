const fs = require('fs')
const {google} = require('googleapis')
const puppeteer = require('puppeteer')
const privatekey = require('../../token.json')

const sheetID = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"
const endDate = new Date(2015, 11, 31, 12, 00)
const localPath = "D:/tTemp/"

console.log("Browser Automated Downloader")

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

function getLastDate(callback){
    google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: sheetID,
        range: 'filenames!A1:B'
    }, function (_, response){
        callback(response.data.values)
    })
}

getLastDate(processLastDateNProceed)

function processLastDateNProceed(data){
    if (data == undefined){
        data = [["2000-12-31", ""]]
    }
    data.sort(function(a, b){
        gdateStrA = a[0].split("-")
        gdateStrB = b[0].split("-")
        
        return new Date(gdateStrA[0], gdateStrA[1], gdateStrA[2]) - new Date(gdateStrB[0], gdateStrB[1], gdateStrB[2])
    })
    // console.log(data)

    var glastDateStr = data[data.length - 1][0]
    var glastDateStrParts = glastDateStr.split("-")
    console.log("Last Updated Date: ", glastDateStr)
    
    var startDate = new Date(glastDateStrParts[0], parseInt(glastDateStrParts[1]) - 1, glastDateStrParts[2], 12, 00)
    startDate.setDate(startDate.getDate() + 1)  // required for starting from the next Date
    startDownloadingEqBhav(startDate)
}

async function startDownloadingEqBhav(startDate) {

	const browser = await puppeteer.launch({
        headless: false,
        args:['--user-data-dir=ChromeProfile']
    })

    var lastDateReached = false
    // for (var i = 0; i < 1; i++){
    while (!lastDateReached){
        var isWeekend = (startDate.getDay() === 6) || (startDate.getDay() === 0)
        if(!isWeekend){
            var dateStr = startDate.getDate().toString().padStart(2, '0') + "-" + (startDate.getMonth() + 1).toString().padStart(2, '0') + "-" + startDate.getFullYear().toString()
            var gdateStr = startDate.getFullYear().toString() + "-" + (startDate.getMonth() + 1).toString().padStart(2, '0') + "-" + startDate.getDate().toString().padStart(2, '0')
            const page = await browser.newPage()
            
            var url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=" + dateStr + "&section=EQ"
            var selector = "body > table > tbody > tr > td > a:nth-child(1)"
            
            await page.goto(url)
            try{
                await page.waitFor(selector)
            } catch (e) {
                await page.close()
                startDate.setDate(startDate.getDate() + 1)
                continue
            }
                
            let element = await page.$(selector)
            let fileName = await page.evaluate(el => el.textContent, element)
            // console.log(fileName)
            
            await page.click(selector)
            await page.waitFor(3000)
            await page.close()
            
            uploadUpdateNDelete(gdateStr, fileName)
            
        }
        startDate.setDate(startDate.getDate() + 1)

        if (endDate.getTime() < startDate.getTime()){
            lastDateReached = true
            browser.close()
        }
    }
}

function uploadUpdateNDelete(gdateStr, fileName){
    var filePath = localPath + fileName;
    // console.log(filePath);

    while(!fs.existsSync(filePath)){
        // console.log("Waiting for File", fileName)
    }

    if (fs.existsSync(filePath)){
        var fileMetadata = {
            'name': fileName,
            'parents': ['1JisycVBhjzOXNdh0C-la8otvlIOLdPQN']
        };
        var media = {
            mimeType: 'application/zip',
            body: fs.createReadStream(filePath)
        };
        google.drive('v3').files.create({
            auth: jwtClient,
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log(fileName, "uploaded successfully")
            
            var resource = {
                auth: jwtClient,
                spreadsheetId: sheetID,
                range: 'A:B',
                valueInputOption: 'RAW',
                resource:{
                    values: [[gdateStr, fileName]]
                }
            }
            
            google.sheets('v4').spreadsheets.values.append(resource, function (_, _){})
            fs.unlink(filePath, function(_){})
        }
        });
    }
}