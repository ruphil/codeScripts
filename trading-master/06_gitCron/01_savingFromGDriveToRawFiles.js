const https = require('https');
const {google} = require('googleapis');
const privatekey = require('../../token.json');

var currentTime = new Date()
currentTime.setHours(currentTime.getHours() + 5)
currentTime.setMinutes(currentTime.getMinutes() + 30)
var yearC = currentTime.getFullYear()
var monthC = currentTime.getMonth().toString().padStart(2, '0')
var dateC = currentTime.getDate().toString().padStart(2, '0')
var hourC = currentTime.getHours().toString().padStart(2, '0')
var minC = currentTime.getMinutes().toString().padStart(2, '0')
var secC = currentTime.getSeconds().toString().padStart(2, '0')

var timeC = yearC + "/" + monthC + "/" + dateC + " [" + hourC + ":" +  minC + ":" + secC + "]"
        
console.log(timeC + " > " +  "Starting CRON Job To Run Forever")

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const sheetID = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"
const parentFolder = "11IVj3PZ52g-oGqs6l1OC7qcQJWWMFhog"

var timeInterval = 30 * 60 * 1000 // Every Half An Hour
// var timeInterval = 10 * 1000
setInterval(runJob, timeInterval)

function runJob(){
    getLastDate(processLastDateNProceed)
}

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
    var todaysDateRef = new Date()
    var todaysDate = new Date(todaysDateRef.getFullYear().toString(), todaysDateRef.getMonth().toString(), todaysDateRef.getDate().toString())

    if (data == undefined){
        return
    }
    data.sort(function(a, b){
        gdateStrA = a[0].split("-")
        gdateStrB = b[0].split("-")
        
        return new Date(gdateStrA[0], gdateStrA[1], gdateStrA[2]) - new Date(gdateStrB[0], gdateStrB[1], gdateStrB[2])
    })
    // console.log(data)

    var glastDateStr = data[data.length - 1][0]
    var glastDateStrParts = glastDateStr.split("-")

    var currentTime = new Date()
    currentTime.setHours(currentTime.getHours() + 5)
    currentTime.setMinutes(currentTime.getMinutes() + 30)
    // console.log(currentTime.toUTCString())

    var yearC = currentTime.getFullYear()
    var monthC = currentTime.getMonth().toString().padStart(2, '0')
    var dateC = currentTime.getDate().toString().padStart(2, '0')
    var hourC = currentTime.getHours().toString().padStart(2, '0')
    var minC = currentTime.getMinutes().toString().padStart(2, '0')
    var secC = currentTime.getSeconds().toString().padStart(2, '0')

    var timeC = yearC + "/" + monthC + "/" + dateC + " [" + hourC + ":" +  minC + ":" + secC + "]"

    var dayC = currentTime.getDay()
    // console.log("Current DateTime: ", currentTime.toUTCString())
    // console.log("Last Updated Date: ", glastDateStr)
    
    var lastDate = new Date(glastDateStrParts[0], parseInt(glastDateStrParts[1]) - 1, glastDateStrParts[2])
    if((dayC != 6) && (dayC != 0) && (hourC > 17 && hourC < 20)){
        if (lastDate.getTime() < todaysDate.getTime()){
            downloadNUpload(todaysDate)
        } else {
            console.log(timeC + " > " + "File Already Available")
        }
    }
}