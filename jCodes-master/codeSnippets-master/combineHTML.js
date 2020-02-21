const fs = require('fs');
const cheerio = require('cheerio');
const os = require('os');
const path = require('path');


var homeDir = os.homedir();
var filesDir = homeDir + '/Downloads/';
var desktop = homeDir + '/Desktop/';

console.log();
fs.readdir(filesDir, function(err, files){
    files = files.map(function (fileName) {
      return {
        name: fileName,
        time: fs.statSync(filesDir + fileName).mtime.getTime()
      };
    })
    .sort(function (a, b) {
      return a.time - b.time; })
    .map(function (v) {
      return v.name; });

    // console.log(files);
    
    var fileName = 'hinduEditorial ' + new Date().toISOString().split('T')[0];
    var body = `<h1 style='color:blue'>${fileName}</h1>`;

    files.forEach(file => {
      if(path.extname(file) == '.html'){
        var data = fs.readFileSync(filesDir + file);
        var $ = cheerio.load(data.toString());
        body += $('body').html();
      }
    });

    fs.writeFile(desktop + fileName + '.html', body, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
});
