var PNGImage = require('pngjs-image');

var colorAdjusted = 'D:/vtTileOut/coloradjusted.png';
var cleaned = 'D:/vtTileOut/cleaned.png';

PNGImage.readImage(colorAdjusted, function (err, image) {
    if (err) throw err;
  
    var width = image.getWidth();
    var height = image.getHeight();
    var outImg = PNGImage.createImage(width, height)


    for (var x = 0; x < width; x++){
      for (var y = 0; y < height; y++){
  
        var red = image.getColor(x, y) & 0xFF;

        if (red != 0){
            var toRetain = checkCleaning(image, x, y);
            if(toRetain){
                outImg.setAt(x, y, { red:50, green:50, blue:50, alpha:255 });
            }
        }
      }
    }
    
    outImg.writeImage(cleaned, function (err) {
      if (err) throw err;
      console.log('Written to the file');
    });
});

function checkCleaning(image, x, y){
    var gridRow = [];
    for (var i = -2; i <= 2; i++){
        var red = image.getColor(x + i, y) & 0xFF;
        gridRow.push(red);
    }

    var gridCol = [];
    for (var i = -2; i <= 2; i++){
        var red = image.getColor(x, y + i) & 0xFF;
        gridCol.push(red);
    }

    var condition1 = gridRow[0] == 0 && gridRow[1] > 0 && gridRow[2] > 0 && gridRow[3] == 0 && gridRow[4] == 0;
    var condition2 = gridCol[0] == 0 && gridCol[1] == 0 && gridCol[2] > 0 && gridCol[3] > 50 && gridCol[4] == 0;

    if ( condition1 || condition2 ){
        return false;
    } else return true;
}
