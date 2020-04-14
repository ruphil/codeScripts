const fs = require('fs')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

const sheetID = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"

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
    data.sort(function(a, b){
        dateStrA = a[0].split("-")
        dateStrB = b[0].split("-")
        
        return new Date(dateStrA[0], dateStrA[1], dateStrA[2]) - new Date(dateStrB[0], dateStrB[1], dateStrB[2])
    })
    // console.log(data)

    var lastDate = data[data.length - 1][0]
    console.log(lastDate)
    
}

