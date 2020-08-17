const fs = require('fs')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

const sheetID = "1SmP6l95Gyws2RPUY-H_vUqgAvsiHOhtXZQJE1znrLKk"

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
    console.log(startDate)
}
