const https = require('https')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

console.log("Downloading Files From URL")
const sheetID = "1SmP6l95Gyws2RPUY-H_vUqgAvsiHOhtXZQJE1znrLKk"
var endstartDate = new Date(2020, 01, 29, 12, 00)
// var endstartDate = new Date(2016, 00, 05, 12, 00)

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
        data = [["2015-12-31", ""]]
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

function startDownloadingEqBhav(startDate) {
    // console.log(startDate)
    var generateDateInterval = setInterval(generateDate, 2000)

    function generateDate(){
        var isWeekend = (startDate.getDay() === 6) || (startDate.getDay() === 0)
        if(!isWeekend){
            downloadNUpload(startDate)
        }
        startDate.setDate(startDate.getDate() + 1)

        if (endstartDate.getTime() < startDate.getTime()){
            clearInterval(generateDateInterval)
        } 
    }
}

function downloadNUpload(d){
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    var dayStr = d.getDate().toString().padStart(2, '0') 
    var monStr = monthNames[d.getMonth()]
    var yearStr = d.getFullYear().toString()

    var gdateStr = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0')

    var url = "https://www1.nseindia.com/content/historical/EQUITIES/" + yearStr + "/" + monStr + "/cm" + dayStr + monStr + yearStr + "bhav.csv.zip"
    // console.log(url)

    var fileName = url.replace(/^.*[\\\/]/, '')
    // console.log(fileName)

    https.get(url, function(resStrm) {

        console.log("Date: ", gdateStr, "Status Code: ", resStrm.statusCode)
        if(resStrm.statusCode != 200){
            return
        }

        var fileMetadata = {
            'name': fileName,
            'parents': ['1EOHBdpqAS74tLajXJPk0HsfAM9op-w8Q']
        }
        
        var media = {
            mimeType: 'application/zip',
            body: resStrm
        }
        
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
            }
        }) 
    })
}
