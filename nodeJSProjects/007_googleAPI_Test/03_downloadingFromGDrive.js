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

var fileName = process.argv[2];
var destPath = "";

if (process.platform === "win32"){
    destPath = "D:/tData/"
} else if (process.platform === "linux"){
    destPath = "/home/rukmangadanies/"
}

google.drive('v3').files.list({
    auth: jwtClient,
    q: `name contains '${fileName}' and '${folderID}' in parents`,
    // fields: '*',
    fields: 'files(id, originalFilename)',
    spaces: 'drive'
    }, function (_, resp) {
        // console.log(resp.data.files[0]);
        downloadFile(resp.data.files[0]);
    }
);

function downloadFile(metadata){
    var fileId = metadata.id;
    var fileName = metadata.originalFilename;
    // console.log(fileId, fileName);

    var filePath = destPath + fileName;
    // console.log(filePath);

    var dest = fs.createWriteStream(filePath);
    google.drive('v3').files.get({
        auth: jwtClient,
        fileId: fileId,
        alt: 'media'
    }, {responseType: 'stream'}, function(err, res){
        res.data
        .on('end', () => {
            console.log(filePath , 'Done');
        })
        .on('error', err => {
            console.log('Error', err);
        })
        .pipe(dest);
    });
}