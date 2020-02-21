const fs = require('fs');
const request = require('sync-request');

var apiKey = fs.readFileSync('../../apiKey.txt');

var url = 'https://www.googleapis.com/storage/v1/b?project=lively-crane-good&key=' + apiKey;

var res = request('GET', url);
var resJSON = JSON.parse(res.getBody('utf8'));
console.log(resJSON);