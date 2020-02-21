const request = require('sync-request');
const cheerio = require('cheerio')
const sleep = require('system-sleep');
const Excel = require('exceljs');

var urlParent = 'https://www.studyiq.com/downloads/free-pdfs/daily-hindu-editorial-news-analysis-notes-summary-discussion-hindi/epaper-english?page=';
var content = '';

var pageLimit = 5;
// var pageLimit = 20;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var workbook = new Excel.Workbook();

var sheets = [];
monthNames.forEach(function(item){
    var sheet = workbook.addWorksheet(item);
    sheet.getRow(1).getCell(1).value = item;
    sheets.push(sheet);
});


for (var page = 21; page >= pageLimit; page--){
    var actualURL = urlParent + page;
    var body = request('GET', actualURL).getBody();
    var $ = cheerio.load(body);

    for (var i = 1; i <= 30; i++){
        var anchElem = '#searchList > ul > li:nth-child(' + i + ') > a'

        var ancInfo = $(anchElem).text();
        if(!ancInfo.includes('Veer') && !ancInfo.includes('VeeR') && !ancInfo.includes('2017') && !ancInfo.includes('2019'))
        {
            for (var j = 0; j < monthNames.length; j++){
                if(ancInfo.includes(monthNames[j])){
                    var lastRow = sheets[j].lastRow.number;
                    var newRow = lastRow + 1;

                    sheets[j].getRow(newRow).getCell(1).value = ancInfo;
                    sheets[j].getRow(newRow).getCell(2).value = $(anchElem).attr('href');
                }
            }
        }
    }

    console.log(`Page - ${page} has completed fetching`);
    sleep(2000);
}

workbook.xlsx.writeFile('D:/filesFetched/links.xlsx')
.then(function() {
    console.log('written successfully');
});
