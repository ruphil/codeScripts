const fs = require('fs');

let basePath = "C:/USERFILES/";
let pagesPath = basePath + "jack/";

let pages = fs.readdirSync(pagesPath);
// console.log(pages);

var currentFoundPage = 0;
var i = 0;
while(currentFoundPage < pages.length){
    let page = pagesPath + "/Image (" + (i + 1).toString() + ").png"
    i++;
    // console.log(page);
    if(!fs.existsSync(page)){
        // console.log("Came Here");
        continue;
    }

    let newPage = pagesPath + "/Image (" + (currentFoundPage + 1).toString() + ").png";
    console.log(page, newPage);
    fs.renameSync(page, newPage);

    currentFoundPage++;
}
