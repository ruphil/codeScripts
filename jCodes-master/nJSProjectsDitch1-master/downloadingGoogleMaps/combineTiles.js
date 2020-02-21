var PNGImage = require('pngjs-image');
const fs = require('fs');


var location = 'D:/vtTiles/';
var out = 'D:/vtTileOut/out.png';

var outImg = PNGImage.createImage(8192, 8192);

fs.readdirSync(location).forEach(file => {
    var filePath = location + file;

    var imgID = file.substring(3);
    var tileRowPos = parseInt(imgID.split(' ')[0]);
    var tileColPos = parseInt(imgID.split(' ')[1].slice(0, -4));
    // console.log(file, tileRowPos, tileColPos);

    var image = PNGImage.readImageSync(filePath);

    var width = image.getWidth();
    var height = image.getHeight();

    for (var x = 0; x < width; x++){
        for (var y = 0; y < height; y++){
            var out_x = (tileColPos - 1) * 256 + x;
            var out_y = (tileRowPos - 1) * 256 + y;
            outImg.setAt(out_x, out_y, image.getAt(x, y));
            
        }
    }

});

outImg.writeImageSync(out);