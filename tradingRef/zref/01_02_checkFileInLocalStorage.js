const fs = require('fs')
const localPath = "D:/tRawFiles"

var fileName = "cm19MAR2003bhav.csv.zip"

var ifFileExists = checkFileName(fileName)
console.log(ifFileExists);

function checkFileName(fileName){
    var fileAvailable = false
    fs.readdirSync(localPath).forEach(file => {
        if (file == fileName){
            fileAvailable = true
        }
    });
    return fileAvailable
}