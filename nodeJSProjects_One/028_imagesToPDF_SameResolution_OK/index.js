const fs = require('fs');
const PDFDocument = require('pdfkit')

let pdf = new PDFDocument({
    autoFirstPage: false
});

let basePath = "C:/jData/";
let imgsPth = basePath + "A Bouquet of Services/";

let imgs = fs.readdirSync(imgsPth);

pdf.pipe(fs.createWriteStream(basePath + 'output.pdf'));

for (let i = 0; i < imgs.length; i++) {
    let eachImgPath = imgsPth + imgs[i];
    const img = pdf.openImage(eachImgPath);
    pdf.addPage({size: [img.width, img.height]});
    pdf.image(img, 0, 0);
}

pdf.end();
console.log("done");