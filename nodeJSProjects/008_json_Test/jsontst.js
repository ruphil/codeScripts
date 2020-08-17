const fs = require('fs');
console.log("hey");

// var path = "D:/jData/mike/";
var path = 'C:/Users/rukmangadan/Documents/GitHub/globalFileStore/';

var symJson = {};
for (var j = 1; j < 12; j++){
    symJson[j]=j+2;
}

// console.log(symJson);
var jsonStr = JSON.stringify(symJson);

for (var i = 1; i < 2000; i++){
    fs.writeFileSync(path + `mike${i}.json`, jsonStr, 'utf-8');
}