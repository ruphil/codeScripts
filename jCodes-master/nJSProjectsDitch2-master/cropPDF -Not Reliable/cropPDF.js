const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');
const PDF2Pic = require("pdf2pic");
const sharp = require('sharp');
const PDFDocument = require('pdfkit');

const pdf2pic = new PDF2Pic({
  density: 600,
  // size: "2x1"
  size: "1080x1440",
  // size: "2160x2880",
  // size: "4320x5760",
});

var url = './input.pdf';
var rawData = new Uint8Array(fs.readFileSync(url));
pdfjsLib.getDocument(rawData).promise.then(function(pdfDocument) {
  var totalPages = pdfDocument.numPages;
  var pagesArray = Array.apply(null, {length: totalPages}).map(Number.call, Number).map(x => x + 1);

  Promise.all(pagesArray.map(page => pdf2pic.convertToBase64("./input.pdf", page))).then(pageImgs => {
    console.log(pageImgs.length);

    var options = [
      { position: 'left top' },
      { position: 'left bottom' }
    ];
    
    var combos = [];
    pageImgs.forEach(function(p){
      options.forEach(function(o){
        combos.push([p,o]);
      });
    });
    // console.log(combos);
    
    return Promise.all(combos.map(combo_each => {
      // console.log(combo_each);
      return sharp(Buffer.from(combo_each[0].base64, 'base64')).resize(1080, 1440/2, combo_each[1]).toBuffer();
    }))
  })
  .then(buffers => {
  // ---------------------------        Testing Script for quality
  // buffers.forEach(function (buffer, index){
  //   var fileName = './outImgs/img_' + index + '.png';
  //   fs.writeFileSync(fileName, buffer);
  // });
    
    
  // ----------------------------         Main Script
    var doc = new PDFDocument({
        autoFirstPage: false,
        layout : 'landscape',
        margin: 0,
    });
    
    var ordering = fs.readFileSync('./ordering.txt', 'utf-8');
    var groupings = ordering.split(",");
    groupings.forEach(function (group, groupIndex){
      var pageEqualizer = 0;
      var indexes = group.split('-');
      var start = indexes[0] - 1;
      var end = indexes[1] - 1;
      for (var p = start; p <= end; p++){
        doc.addPage({size: [1080, 1440/2]});
        doc.image(buffers[p], {
          // size: [1440*72, 1080*72],
          // fit: [1440, 1080],
          scale: 0.72,
          // scale: 0.7,
          // size: 'A0',
          align: 'center',
          valign: 'center',
        });
        pageEqualizer++;
        if (!((p == end) && (groupIndex == groupings.length - 1))) doc.addPage();
      }
      var pageEqualizerChecker = (4 - pageEqualizer % 4);
      if (pageEqualizerChecker != 4){
        while(pageEqualizerChecker--){
          doc.addPage({size: [1080, 1440/2]});
        }
      }
    });
    doc.pipe(fs.createWriteStream('./file.pdf'));
    doc.end();

  });
});
