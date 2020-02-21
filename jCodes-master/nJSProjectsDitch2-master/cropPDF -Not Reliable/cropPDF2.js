var Canvas = require('canvas');
var fs = require('fs');
var pdfjsLib = require('pdfjs-dist');

var url = './input.pdf';
var rawData = new Uint8Array(fs.readFileSync(url));
var loadingTask = pdfjsLib.getDocument(rawData);
loadingTask.promise

var pages = returnTotalPages(loadingTask);
var page;
console.log(pages);

function returnTotalPages(loadingTask){
    loadingTask.promise.then(function(pdfDocument) {
        page = pdfDocument.numPages;
        return pdfDocument.numPages;
    });
}

console.log(page);