var fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
var sleep = require('system-sleep');

var inLocation = 'D:/files/';
var tempLocation = 'D:/txtFiles/';

var totalFiles = 0;
fs.readdirSync(inLocation).forEach(file => {
    // console.log(file);
    var command = __dirname + '/dependencies/pdftotext.exe '+ '"' + inLocation + file + '" ' + '"' + tempLocation + file + '".txt';
    // console.log(command);
    execSync(command);
    var content = fs.readFileSync(tempLocation + file + '.txt', 'utf-8');
    // console.log(content);
    if(content.toUpperCase().includes(('mains').toUpperCase())){
        console.log(file);
        totalFiles++;
    }
    sleep(1000);
});

console.log(totalFiles);
console.log('done');
