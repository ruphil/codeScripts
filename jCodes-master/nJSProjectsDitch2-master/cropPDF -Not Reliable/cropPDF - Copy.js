var Canvas = require('canvas');
var assert = require('assert');
var fs = require('fs');
var pdfjsLib = require('pdfjs-dist');
const sharp = require('sharp');
var sleep = require('system-sleep');
const PDFDocument = require('pdfkit');


// winston.level = 'debug';

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

var url = './input.pdf';
var rawData = new Uint8Array(fs.readFileSync(url));

var loadingTask = pdfjsLib.getDocument(rawData);
loadingTask.promise.then(function(pdfDocument) {
  console.log('# PDF document loaded.');
  var totalPages = pdfDocument.numPages;
  console.log(totalPages);
  for (var i = 1; i <= totalPages; i++){
    
    console.log(i);
    pdfDocument.getPage(i).then(function (page) {
      // Render the page on a Node canvas with 100% scale.

      var viewport = page.getViewport({ scale: 2.0, });
      var canvasFactory = new NodeCanvasFactory();
      var canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
      var width = viewport.width;
      var height = viewport.height;

        console.log(viewport.width, viewport.height);
      var renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory,
      };

      var renderTask = page.render(renderContext);
      renderTask.promise.then(function() {
        // Convert the canvas to an image buffer.
        var image = canvasAndContext.canvas.toBuffer();
        sharp(image)
          .resize(width, height/2, {
            position: 'left top',
          })
          .toFile('./outImgs/output' + i + '_a.png', (err, info) => {});
        
        sharp(image)
          .resize(width, height/2, {
            position: 'left bottom',
          })
          .toFile('./outImgs/output' + i + '_b.png', (err, info) => {});
      });
    });
    sleep(2*1000);
    if(i == totalPages) makePDFs();
  }
}).catch(function(reason) {
  console.log(reason);
});

function makePDFs(){
  console.log('making pdf');
  var data = fs.readFileSync('./ordering.txt');
  const doc = new PDFDocument;
  doc.image('./outImgs/output1_a.png', 0, 0);
  doc.image('./outImgs/output1_b.png', 0, 0);
  doc.pipe(fs.createWriteStream('./file.pdf'));
  doc.end();
}