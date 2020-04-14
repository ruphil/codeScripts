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

var dateStr = "2003-05-20"
var fileName = "mik.zip"

var resource = {
    auth: jwtClient,
    spreadsheetId: sheetID,
    range: 'A:B',
    valueInputOption: 'RAW',
    resource:{
        values: [[dateStr, fileName]]
    }
}

google.sheets('v4').spreadsheets.values.append(resource, function (_, _){})