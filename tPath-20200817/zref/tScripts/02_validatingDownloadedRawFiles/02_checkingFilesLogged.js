const {google} = require('googleapis')
const privatekey = require('../../token.json')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const sheetID_AllDownloaded = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"
const folderID_AllDownloaded = "11IVj3PZ52g-oGqs6l1OC7qcQJWWMFhog"

var currentSheetID = sheetID_AllDownloaded
var currentFolderID = folderID_AllDownloaded

var fileNames = []
var nextPgToken = ''

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

        var filesNotFound_S = 0
        filesInSheet.forEach(elS => {
            var fileName_S = elS[1]
            var fileFound_S = false
            filesInDrive.forEach(elD => {
                var fileName_D = elD.name
                if (fileName_S == fileName_D){
                    fileFound_S = true
                }
            })
            if (!fileFound_S){
                filesNotFound_S++
                console.log(fileName_S, "Not Found In Drive")
            }
        })

        var filesNotFound_D = 0
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
            }
        })

        console.log("Final Files Length: ", filesInDrive.length)
        console.log("Files In Sheet Length: ", filesInSheet.length)
        console.log("Sheet Files Not Found Count: ", filesNotFound_S)
        console.log("Drive Files Not Listed Count: ", filesNotFound_D)
    })
}
