const fs = require('fs');
const PDFDocument = require('pdfkit');

let pdf = new PDFDocument({
    autoFirstPage: false
});

let basePath = "C:/USERFILES/";

pdf.pipe(fs.createWriteStream(basePath + 'output.pdf'));

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

for (let i = 0; i < foldersArray.length; i++){
    let pagesPath = basePath + foldersArray[i][0];
    let imgCount = fs.readdirSync(pagesPath).length;
    // console.log(imgCount);

    for (let j = 0; j < imgCount; j++){
        let frontPagePath = basePath + foldersArray[i][0] + "/Image (" + (j + 1).toString() + ").jpg" ;
        let backPagePath = basePath + foldersArray[i][1] + "/Image (" + (imgCount - (j)).toString() + ").jpg" ;
        
        const imgF = pdf.openImage(frontPagePath);
        pdf.addPage({size: [imgF.width, imgF.height]});
        pdf.image(imgF, 0, 0);

        const imgB = pdf.openImage(backPagePath);
        pdf.addPage({size: [imgB.width, imgB.height]});
        pdf.image(imgB, 0, 0);
    }
}

pdf.end();
console.log("done");