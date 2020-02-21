const fs = require('fs');
const request = require('sync-request');
const cheerio = require('cheerio');
const sleep = require('system-sleep');
const pdf = require('html-pdf');

var apiKey = fs.readFileSync('../../apiKey.txt');
var outLocation = 'D:/filesFetched/';

var playlistID = 'PL6o7r0bOFT0iUVsUAhOzwKD7mug2OasjG';
var maxResults = 50;
var pageToken = '';

var url = `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${playlistID}&key=${apiKey}`;
var res = request('GET', url);
var resJSON = JSON.parse(res.getBody('utf8'));

var totalItems = resJSON.items[0].contentDetails.itemCount;
// console.log(totalItems);

var i = 0;
while (i < totalItems){
    var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&pageToken=${pageToken}&playlistId=${playlistID}&key=${apiKey}`;
    
    var res = request('GET', url);
    var resJSON = JSON.parse(res.getBody('utf8'));
    // console.log(resJSON);

    pageToken = resJSON.nextPageToken;
    var gotItemsCount = resJSON.items.length;
    for (var j = 0; j < gotItemsCount; j++){
        // console.log(resJSON);
        var videoID = resJSON.items[j].snippet.resourceId.videoId;

        var videoURL = `https://content.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${apiKey}`;
        var videoRes = request('GET', videoURL);
        var videoResJSON = JSON.parse(videoRes.getBody('utf8'));

        var publishDate = videoResJSON.items[0].snippet.publishedAt;
        // console.log(publishDate);

        date = new Date(publishDate);
        year = date.getFullYear();
        month = date.getMonth()+1;
        dt = date.getDate();

        if (dt < 10) {
        dt = '0' + dt;
        }
        if (month < 10) {
        month = '0' + month;
        }
        
        var titleStr = 'BJYUs IAS ' + year + '-' + month + '-'+ dt;

        var description = resJSON.items[j].snippet.description;

        // console.log(title, description);
        var CNALink = '';
        try{
            CNALink = description.split('https://byjus.com/free-ias-prep')[1].split('\n')[0];
            CNALink = 'https://byjus.com/free-ias-prep' + CNALink;
        } catch (e){
            continue;
        }
        
        // console.log(CNALink);
        // console.log('----------------------------------------------------------------------------------------------------');

        var response = request('GET', CNALink);
        if (response.statusCode != 200){
            console.log('There was some error accessing webpage');
            
            startDate.setDate(startDate.getDate() + 1);
            sleep(3000);
            continue;
        }

        var body = response.getBody();
        var $ = cheerio.load(body);

        var html = $('body > div.wrapper > div.container > div > div.col-sm-7.col-md-8 > div').html();

        var fileFullPath = outLocation + titleStr + '.pdf';
        pdf.create(html).toFile(fileFullPath, function(err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });

        sleep(2000);

    }

    i += gotItemsCount;
    sleep(2000);
    console.log(`completed ${i}`);
}

console.log('done');