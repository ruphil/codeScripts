const request = require('sync-request');
const cheerio = require('cheerio');
const sleep = require('system-sleep');
const pdf = require('html-pdf');

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

var dateToGet = new Date(2018, 08, 05);

var date = pad(dateToGet.getDate(), 2);
var month = monthNames[dateToGet.getMonth()];
var year = dateToGet.getFullYear();

// var URL = 'https://byjus.com/free-ias-prep/upsc-exam-comprehensive-news-analysis-jan01-2019';
var URL = `https://byjus.com/free-ias-prep/upsc-exam-comprehensive-news-analysis-${month}${date}-${year}`;
// var URL = `https://byjus.com/free-ias-prep/upsc-exam-comprehensive-news-analysis-${month}${date}/`;
console.log(URL);

var response = request('GET', URL);
if (response.statusCode != 200){
    console.log('There was some error accessing webpage');
    process.exit();
}

var body = response.getBody();
var $ = cheerio.load(body);

var html = $('body > div.wrapper > div.container > div > div.col-sm-7.col-md-8 > div').html();

var dt = dateToGet.getDate();
var mon = dateToGet.getMonth() + 1;

if (dt < 10) {
    dt = '0' + dt;
}
if (mon < 10) {
    mon = '0' + mon;
}

var titleStr = 'BJYUs IAS ' + year + '-' + mon + '-'+ dt;

var folder = 'D:/filesFetched1/';
var fileFullPath = folder + titleStr + '.pdf';

pdf.create(html).toFile(fileFullPath, function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
});