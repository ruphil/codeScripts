const https = require('https')
const fs = require('fs')
const {google} = require('googleapis')
const privatekey = require('../../token.json')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

console.log("Downloading Files From URL")

var url = "https://www1.nseindia.com/content/historical/EQUITIES/2017/SEP/cm13SEP2017bhav.csv.zip"
var fileName = url.replace(/^.*[\\\/]/, '')
// console.log(fileName)

https.get(url, function(resStrm) {
    var fileMetadata = {
        'name': fileName,
        'parents': ['11IVj3PZ52g-oGqs6l1OC7qcQJWWMFhog']
    }
    
    var media = {
        mimeType: 'application/zip',
        body: resStrm
    }
    
    google.drive('v3').files.create({
        auth: jwtClient,
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log(fileName, "uploaded successfully")
        }
    }) 
})
