const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const privatekey = require('../../token.json');
const mime = require('mime-types');

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/drive']
);

var folderID = "1WiKZEGhO8KMjuPt93g76H7ef3jtHqwDZ";

var filePath = path.resolve(process.argv[2]);

var fileName = path.basename(filePath, path.extname(filePath))
var mimeType = mime.lookup(filePath);
console.log(filePath, mimeType, fileName);

if (fs.existsSync(filePath)){
    var fileMetadata = {
        name: fileName,
        parents: [folderID]
    };

    var media = {
        mimeType: mimeType,
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