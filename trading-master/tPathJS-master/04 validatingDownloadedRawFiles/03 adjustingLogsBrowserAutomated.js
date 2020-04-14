const {google} = require('googleapis')
const privatekey = require('../../token.json')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const sheetID_tBrowserAutomated = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"
const folderID_tBrowserAutomated = "1JisycVBhjzOXNdh0C-la8otvlIOLdPQN"

currentSheetID = sheetID_tBrowserAutomated
currentFolderID = folderID_tBrowserAutomated

var fileNames = []
var nextPgToken = ''

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

function getFilesListNCheckSheet(nextPgToken){
    google.drive('v3').files.list({
        auth: jwtClient,
        q: `'${currentFolderID}' in parents`,
        fields: 'nextPageToken, files(id, name)',
        pageSize: 1000,
        pageToken: nextPgToken,
        spaces: 'drive'
        }, function (_, response) {
            var responseFiles = response.data.files
            // console.log("Response Files Length: ", responseFiles.length)
            
            fileNames.push(...responseFiles)
            // console.log("Current FileNames Length: ", fileNames.length)

            var nextPgToken = response.data.nextPageToken
            // console.log("Next Page Token: ", nextPgToken)

            if (nextPgToken != undefined){
                getFilesListNCheckSheet(nextPgToken)
            } else {
                checkFilesInDriveWithSheets(fileNames)
            }
        }
    )
}

getFilesListNCheckSheet(nextPgToken)

function checkFilesInDriveWithSheets(filesInDrive){
    google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: currentSheetID,
        range: 'filenames!A1:B'
    }, function (_, response){
        filesInSheet = response.data.values

        var filesNotFound_D = 0
        var fileNotFoundNames = []
        filesInDrive.forEach(elD => {
            var fileName_D = elD.name
            var fileFound_D = false
            filesInSheet.forEach(elS => {
                var fileName_S = elS[1]
                if (fileName_S == fileName_D){
                    fileFound_D = true
                }
            })
            if (!fileFound_D){
                filesNotFound_D++
                console.log(fileName_D, "Not Found In Sheet")
                fileNotFoundNames.push(fileName_D)
            }
        })

        console.log("Final Files Length: ", filesInDrive.length)
        console.log("Files In Sheet Length: ", filesInSheet.length)
        console.log("Drive Files Not Listed Count: ", filesNotFound_D)
        insertRows(fileNotFoundNames)
    })
}

function insertRows(fileNotFoundNames){
    var i = 0
    var insertInterval = setInterval(function (){
        // console.log(fileNotFoundNames[i])
        insertFileNameRow(fileNotFoundNames[i])
        
        i++
        if (i == fileNotFoundNames.length){
            clearInterval(insertInterval)
        }
    }, 2000)
    // console.log(fileNotFoundNames)
}

function insertFileNameRow(fileName_D){
    var date = fileName_D.substring(2, 4)
    var monStr = (parseInt(monthNames.indexOf(fileName_D.substring(4, 7))) + 1).toString().padStart(2, '0')
    var year = fileName_D.substring(7, 11)

    var gdateStr = year + "-" + monStr + "-" + date

    var resource = {
        auth: jwtClient,
        spreadsheetId: currentSheetID,
        range: 'A:B',
        valueInputOption: 'RAW',
        resource:{
            values: [[gdateStr, fileName_D]]
        }
    }
    
    google.sheets('v4').spreadsheets.values.append(resource, function (_, _){
        console.log(gdateStr, fileName_D, "Updated In Sheet")
    })
}
