const fs = require('fs');
const request = require('sync-request');

var apiKey = fs.readFileSync('../../apiKey.txt');

var channelID = 'UCRnSpYF5dQ6dUEdWEjk4P-Q';
var maxResults = 50;
var pageToken = '';
var totalItems = 1;

var i = 0;
while (i < totalItems){
    var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=${maxResults}&pageToken=${pageToken}&key=${apiKey}`;
    var res = request('GET', url);
    var resJSON = JSON.parse(res.getBody('utf8'));
    // console.log(resJSON);
    var gotItemsCount = resJSON.items.length;

    pageToken = resJSON.nextPageToken;
    totalItems = resJSON.pageInfo.totalResults;

    // console.log(pageToken, gotItemsCount);

    for (var j = 0; j < gotItemsCount; j++){
        var videoID = resJSON.items[j].id.videoId;
        var url = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoID}&key=${apiKey}`
        var res = request('GET', url);
        var capsJSON = JSON.parse(res.getBody('utf8'));

        try {
            var subtitleLang = capsJSON.items[0].snippet.language;
            if (subtitleLang == 'ta') {
                console.log(videoID, subtitleLang);
            }
          } catch (e) {}
    }
    i += gotItemsCount;
    console.log(`completed ${i}`);
}

// var ID1 = 'q1yOcQ73tRw'
// var ID2 = '9lGhEBAgkzg'
// var ID3 = 'tEPgzOFMb-g'

console.log("all done")