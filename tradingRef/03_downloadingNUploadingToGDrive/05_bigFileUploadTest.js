const fs = require("fs");
const querystring = require('querystring');
const {google} = require('googleapis');
const privatekey = require('../../token.json');
const https = require('https');

var jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/drive']
);

var authURL = jwtClient.generateAuthUrl({
    client_id: privatekey.client_id,
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive']
});

console.log(authURL);


// var folderID = "1WiKZEGhO8KMjuPt93g76H7ef3jtHqwDZ";

// var fileName = "rabbit.png";
// var mimeType = "image/png";
// const dirPath = "D:/jData/";
// var filePath = dirPath + fileName;

// var postData = fs.readFileSync(filePath, "utf-8");
// var postData = querystring.stringify({
//     'module' : "jack"
// });

// var options = {
//   hostname: 'ptsv2.com',
//   port: 443,
//   path: '/t/9ln1r-1586328697/post',
//   method: 'POST',
//   headers: {
//        'Content-Type': 'image/png',
//        'Content-Length': postData.length
//      }
// };

// var req = https.request(options, (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   res.on('data', (d) => {
//     process.stdout.write(d);
//   });
// });

// req.on('error', (e) => {
//   console.error(e);
// });

// req.write(postData);
// req.end();