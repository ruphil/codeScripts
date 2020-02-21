const fs = require('fs');
const request = require('sync-request');
const sleep = require('system-sleep');
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

var apiKey = fs.readFileSync('../../apiKey.txt', 'utf-8');
// console.log(apiKey);

var outLocation = 'D:/files/';

var channelId = 'UCj0t9VmB-FNrXuVJJCW7etw';
var part = 'snippet';
var maxResults = 50;

var pageToken = '';
// var pageToken = 'CDIQAA';

var startDate = new Date(2019, 04, 01, 00, 00, 00).toISOString();
var endDate = new Date(2019, 06, 31, 00, 00, 00).toISOString();

var url = encodeURI(`https://content.googleapis.com/youtube/v3/search?channelId=${channelId}&part=${part}&maxResults=${maxResults}&pageToken=${pageToken}&publishedAfter=${startDate}&publishedBefore=${endDate}&key=${apiKey}`);
// console.log(url);

var res = request('GET', url);
var resJSON = JSON.parse(res.getBody('utf8'));
// console.log(resJSON);

var totalItems = resJSON.pageInfo.totalResults;

var i = 0;
while (i < totalItems){
    if (pageToken == undefined){
        break;
    }

    var url = encodeURI(`https://content.googleapis.com/youtube/v3/search?channelId=${channelId}&part=${part}&order=date&maxResults=${maxResults}&pageToken=${pageToken}&publishedAfter=${startDate}&publishedBefore=${endDate}&key=${apiKey}`);
    var res = request('GET', url);
    var resJSON = JSON.parse(res.getBody('utf8'));
    pageToken = resJSON.nextPageToken;
    var gotItemsCount = resJSON.items.length;

    for (var j = 0; j < gotItemsCount; j++){
        var title = resJSON.items[j].snippet.title;
        if (title.toUpperCase().includes(("The").toUpperCase()) && title.toUpperCase().includes(("Hindu").toUpperCase()) && title.toUpperCase().includes(("Analysis").toUpperCase())){
            // var publishedDate = resJSON.items[j].snippet.publishedAt;
        
            // date = new Date(publishedDate);
            // year = date.getFullYear();
            // month = date.getMonth()+1;
            // dt = date.getDate();

            // if (dt < 10) {
            //     dt = '0' + dt;
            // }
            // if (month < 10) {
            //     month = '0' + month;
            // }
            
            // var titleStr = 'SIA-PDF-' + year + '-' + month + '-'+ dt + '.pdf';

            // console.log(titleStr);
            var description = resJSON.items[j].snippet.description;
            // console.log(description);
            var pdfFileId = '';
            try {
                pdfFileId = description.split('id=')[1].split(' ')[0];
            } catch (e) {
                pdfFileId = description.split('/d/')[1].split('/')[0];
            }
            
            // console.log(pdfFileId);
            // var fileId = '1XpTOOk93948L5UMsJXGOtrW0jbKrm_X8';
            

            const drive = google.drive({
                version: 'v3',
                auth: jwtClient,
            });

            drive.files.get({
                fileId: pdfFileId
            }).then(res => {
                var fileName = res.data.name;
                var dest = fs.createWriteStream(outLocation + fileName);
                // console.log(res.data.name);
                drive.files.get(
                    {fileId: pdfFileId, alt: 'media'},
                    {responseType: 'stream'}
                ).then(res => {
                    // console.log(res);
                    res.data.pipe(dest);
                    console.log(fileName + ' written');
                });
            });
            
            sleep(10000);
        }
        
    }

    i += gotItemsCount;
}

console.log('done');
