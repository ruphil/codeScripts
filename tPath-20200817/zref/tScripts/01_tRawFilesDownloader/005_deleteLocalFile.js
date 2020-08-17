const fs = require('fs')
const localPath = "D:/tRawFiles/"

var fileName = "cm12MAR2003bhav.csv.zip"
var filePath = localPath + "cm12MAR2003bhav.csv.zip"

function deleteFile(path){
    fs.unlink(path, function(_){})
}

deleteFile(filePath)