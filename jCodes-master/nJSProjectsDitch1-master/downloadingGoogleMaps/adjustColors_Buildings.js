var PNGImage = require('pngjs-image');

var out = 'D:/vtTiles/vt-5 5.png';
var colorAdjusted = 'D:/vtTiles/vt-5 5_good.png';

PNGImage.readImage(out, function (err, image) {
    if (err) throw err;
  
    var width = image.getWidth();
    var height = image.getHeight();
    var outImg = PNGImage.createImage(width, height)
  
    for (var x = 0; x < width; x++){
      for (var y = 0; y < height; y++){
  
        var uint32 = image.getColor(x, y);
        var red = uint32 & 0xFF;
        var green = uint32 >> 8 & 0xFF;
        var blue = uint32 >> 16 & 0xFF;
        var alpha = 255 - uint32 >> 24 & 0xFF;
        
        if(x == 255 && y == 10) console.log(red, green, blue, alpha);

        var condition1 = (red == 237 & green == 237 & blue == 237 & alpha == 255);
        var condition2 = (red == 255 & green == 248 & blue == 237 & alpha == 255);

        if (condition1 || condition2){
          outImg.setAt(x, y, { red:50, green:50, blue:50, alpha:255 });
        }
  
      }
    }
    
    outImg.writeImage(colorAdjusted, function (err) {
      if (err) throw err;
      console.log('Written to the file');
    });
  
  });