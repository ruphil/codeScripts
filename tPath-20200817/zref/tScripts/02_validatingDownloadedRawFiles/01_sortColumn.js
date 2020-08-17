const fs = require('fs')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

const sheetID_AllDownloaded = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"

var currentSheetID = sheetID_AllDownloaded

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