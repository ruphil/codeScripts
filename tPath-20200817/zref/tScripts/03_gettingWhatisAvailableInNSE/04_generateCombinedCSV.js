const fs = require('fs');

var folderPath = "./NSEAvailableDates/";
var csvGeneratedPath = folderPath + "GeneratedNSE.csv";

var CSVAvailPathFirstPass = folderPath + "NSEAvailFirstPass.csv"
var CSVAvailPathSecondPass = folderPath + "NSEAvailSecondPass.csv"

var NSEAvailCSVFirstPass = fs.readFileSync(CSVAvailPathFirstPass, 'utf-8');
var NSEAvailCSVFirstPassArray = NSEAvailCSVFirstPass.split("\n");
NSEAvailCSVFirstPassArray.pop();

var NSEAvailCSVSecondPass = fs.readFileSync(CSVAvailPathSecondPass, 'utf-8');
var NSEAvailCSVSecondPassArray = NSEAvailCSVSecondPass.split("\n");
NSEAvailCSVSecondPassArray.pop();

var NSEDatesArray = NSEAvailCSVFirstPassArray.concat(NSEAvailCSVSecondPassArray);
console.log(NSEDatesArray.length);

var NSEDatesData = NSEDatesArray.join("\n");
fs.appendFileSync(csvGeneratedPath, NSEDatesData);