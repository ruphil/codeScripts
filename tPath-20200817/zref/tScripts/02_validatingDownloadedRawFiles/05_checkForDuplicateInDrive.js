const {google} = require('googleapis')
const privatekey = require('../../token.json')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const folderID_AllDownloaded = "11IVj3PZ52g-oGqs6l1OC7qcQJWWMFhog"

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

const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
}

function checkFilesInDriveWithSheets(filesInDrive){
    console.log("Total Files In Drive: ", filesInDrive.length)
    // filesInDrive.push(filesInDrive[0])

    var fileNamesArr = filesInDrive.map(function(item){ return item.name })
    var duplicateFiles = findDuplicates(fileNamesArr);
    if (duplicateFiles == "") duplicateFiles = "nil"
    
    console.log(`The duplicates in Files in Drive are ${duplicateFiles}`)
    
}