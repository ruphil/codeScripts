const https = require('https')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

console.log("Starting CRON Job To Run Forever")

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const sheetID = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"

var todaysDate = new Date(2020, 02, 06)
getLastDate(processLastDateNProceed)

function getLastDate(callback){
    google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: sheetID,
        range: 'filenames!A1:B'
    }, function (_, response){
        callback(response.data.values)
    })
}

function processLastDateNProceed(data){
    if (data == undefined){
        var yesterdaysDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate())
        yesterdaysDate.setDate(yesterdaysDate.getDate() - 1)
        var gsterdatStr = yesterdaysDate.getFullYear().toString() + "-" + (yesterdaysDate.getMonth() + 1).toString().padStart(2, '0') + "-" + yesterdaysDate.getDate().toString().padStart(2, '0')
        data = [[gsterdatStr, ""]]
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
    
    var lastDate = new Date(glastDateStrParts[0], parseInt(glastDateStrParts[1]) - 1, glastDateStrParts[2])
    if (lastDate.getTime() < todaysDate.getTime()){
        downloadNUpload(todaysDate)
    } else {
        console.log("File Already Available")
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
            console.log("No Data for ", gdateStr)
            return
        }

        var fileMetadata = {
            'name': fileName,
            'parents': ['11IVj3PZ52g-oGqs6l1OC7qcQJWWMFhog']
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

