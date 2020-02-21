const xlsx = require('xlsx');
var fs = require('fs');
var dir = './tmp';



var xlWrkbk = xlsx.readFile('technicalBids.xlsx');

var worksheet = xlWrkbk.Sheets['Sheet2'];

for (var i = 2; i <= 52; i++){
    var folderName = (worksheet['A' + i]['w'] + ' ' + worksheet['B' + i]['w']).replace(/([^a-z0-9]+)/gi, ' ');
    var folderName = folderName.replace("Under PMA", "");
    console.log(folderName);
    
    var folderPath = './folders/' + folderName;
    // console.log(folderPath);
    
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }
}



