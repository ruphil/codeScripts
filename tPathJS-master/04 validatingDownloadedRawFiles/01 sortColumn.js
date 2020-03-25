const fs = require('fs')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

const sheetID_tBrowserAutomated = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"
const sheetID_tURLDownloaded = "1SmP6l95Gyws2RPUY-H_vUqgAvsiHOhtXZQJE1znrLKk"
const sheetID_tCRONJob = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"

currentSheetID = sheetID_tBrowserAutomated

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

var resource = {
    auth: jwtClient,
    spreadsheetId: currentSheetID,
    resource: {
        requests: [
            {
                "sortRange": {
                  "range": {
                    "sheetId": 0,
                    "startRowIndex": 0,
                    "startColumnIndex": 0,
                    "endColumnIndex": 2
                  },
                  "sortSpecs": [
                    {
                      "dimensionIndex": 0,
                      "sortOrder": "ASCENDING"
                    }
                  ]
                }
            }
        ]
    }
}

google.sheets('v4').spreadsheets.batchUpdate(resource, function (err, resp){
    console.log(err)
    console.log(resp)
})