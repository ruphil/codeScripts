const fs = require('fs');
const {google} = require('googleapis');
const privatekey = require('../../token.json');

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
);

var fileName = "cm19MAR2003bhav.csv.zip"
var fileAvailable = false

google.drive('v3').files.list({
    auth: jwtClient,
    q: "'1JisycVBhjzOXNdh0C-la8otvlIOLdPQN' in parents",
    fields: 'files(name)',
    spaces: 'drive'
    }, function (_, response) {
        gFileName = response.data.files[0].name
        if (fileName == gFileName){
            fileAvailable = true
        }
        console.log(gFileName)
        console.log(fileAvailable)
    }
)

