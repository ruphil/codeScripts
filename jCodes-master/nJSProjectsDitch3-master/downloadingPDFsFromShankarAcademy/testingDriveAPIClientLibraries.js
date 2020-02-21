const fs = require('fs');
const {google} = require('googleapis');
const serviceJSON = require('../../serviceJSON.json');

let jwtClient = new google.auth.JWT(
    serviceJSON.client_email,
    null,
    serviceJSON.private_key,
    [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
    ]
);

var fileId = '1XpTOOk93948L5UMsJXGOtrW0jbKrm_X8';
var dest = fs.createWriteStream('./file.pdf');

const drive = google.drive({
    version: 'v3',
    auth: jwtClient,
});

drive.files.get(
    {fileId, alt: 'media'},
    {responseType: 'stream'}
).then(res => {
    // console.log(res);
    res.data.pipe(dest);
    console.log('done');
});

