const {google} = require('googleapis')
const privatekey = require('../../token.json')
const fs = require('fs')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

var folderPath = "./NSEAvailableDates/";
var csvGeneratedPath = folderPath + "GeneratedNSE.csv";

const sheetID_tBrowserAutomated = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"
const sheetID_tURLDownloaded = "1SmP6l95Gyws2RPUY-H_vUqgAvsiHOhtXZQJE1znrLKk"
const sheetID_tCRONJob = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"

currentSheetID = sheetID_tBrowserAutomated

checkFilesInDriveWithSheets(startCheckingCSV)

function checkFilesInDriveWithSheets(callback){
    google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: currentSheetID,
        range: 'filenames!A1:B'
    }, function (_, response){
        callback(response.data.values)
    }
    )
}

function startCheckingCSV(filesNamesWithDates) {
    // console.log(filesNamesWithDates)

    var csvContent = fs.readFileSync(csvGeneratedPath).toString()
    csvRows = csvContent.split("\n")

    filesNamesWithDates.forEach(sheetRow => {
        var date_S = sheetRow[0].toString()
        var fileName_S = sheetRow[1].toString()

        var rowFound = false
        csvRows.forEach(csvRow => {
            var csvRowParts = csvRow.split(",")

            var date_C = csvRowParts[0]
            var fileName_C = csvRowParts[1]
            // console.log(date_C, date_S, fileName_C, fileName_S)
            if ((date_C == date_S) && (fileName_C.trim() == fileName_S)){
                rowFound = true
                // console.log(date_C, date_S, fileName_C, fileName_S)
            }
        })

        if (!rowFound){
            console.log(date_S, fileName_S, "Not Found In CSV")
        }
    })

}