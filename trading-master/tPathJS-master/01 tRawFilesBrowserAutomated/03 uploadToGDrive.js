const fs = require('fs');
const {google} = require('googleapis');
const privatekey = require('../../token.json');



let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
);

var fileName = "cm12MAR2003bhav.csv.zip"
const localPath = "D:/tRawFiles/"
var filePath = localPath + fileName;
console.log(filePath);

while(!fs.existsSync(filePath)){
    console.log("Waiting for File", fileName)
}

if (fs.existsSync(filePath)){
    var fileMetadata = {
        'name': fileName,
        'parents': ['1JisycVBhjzOXNdh0C-la8otvlIOLdPQN']
    };
    var media = {
        mimeType: 'application/zip',
        body: fs.createReadStream(filePath)
    };
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
    });
}


