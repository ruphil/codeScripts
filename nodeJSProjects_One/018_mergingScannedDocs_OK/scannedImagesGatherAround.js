const fs = require('fs');

let basePath = "C:/jData/Indian Geography - Dr. Khullar/";
let destPath = "C:/jData/Combined - Indian Geography/"

let foldersArray = [
    ["front (1)", "back (1)"],
    ["front (2)", "back (2)"],
    ["front (3)", "back (3)"],
    ["front (4)", "back (4)"],
    ["front (5)", "back (5)"],
    ["front (6)", "back (6)"],
    ["front (7)", "back (7)"],
    ["front (8)", "back (8)"],
    ["front (9)", "back (9)"],
    ["front (10)", "back (10)"],
    ["front (11)", "back (11)"],
    ["front (12)", "back (12)"],
    ["front (13)", "back (13)"],
    ["front (14)", "back (14)"],
];

let pagesCount = 0;
for (let i = 0; i < foldersArray.length; i++){
    let pagesPath = basePath + foldersArray[i][0];
    let imgCount = fs.readdirSync(pagesPath).length;
    // console.log(imgCount);

    for (let j = 0; j < imgCount; j++){
        let frontPagePath = basePath + foldersArray[i][0] + "/Image (" + (j + 1).toString() + ").jpg" ;
        let backPagePath = basePath + foldersArray[i][1] + "/Image (" + (imgCount - (j)).toString() + ").jpg" ;
        
        pagesCount++;
        let copiedFrontPagePath = destPath + "/Image (" + pagesCount.toString() + ").jpg" ;

        pagesCount++;
        let copiedBackPagePath = destPath + "/Image (" + pagesCount.toString() + ").jpg" ;

        fs.copyFileSync(frontPagePath, copiedFrontPagePath);
        fs.copyFileSync(backPagePath, copiedBackPagePath);
    }
}

console.log("done");