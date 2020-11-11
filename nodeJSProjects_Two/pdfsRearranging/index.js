const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

let oddPdf = "C:/USER_DATA/pdfs/P2.pdf";
let evenPdf = "C:/USER_DATA/pdfs/P1.pdf";
let pdfout = "C:/USER_DATA/pdfs/Out.pdf";

async function startWorking(){
    const pdfDoc = await PDFDocument.create();

    const odd = await PDFDocument.load(fs.readFileSync(oddPdf));
    const evn = await PDFDocument.load(fs.readFileSync(evenPdf));

    const totalPgs = odd.getPages().length;

    for (let i = 0; i < totalPgs; i++){
        const [oddpage] = await pdfDoc.copyPages(odd, [0]);
        pdfDoc.addPage(oddpage);

        const [evnpage] = await pdfDoc.copyPages(evn, [0]);
        pdfDoc.addPage(evnpage);
    }

    const pdfBytes = await pdfDoc.save();
    
    fs.writeFileSync(pdfout, pdfBytes);
}

startWorking();