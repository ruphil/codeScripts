const Jimp = require('jimp');

let inImgPath = 'D:/jData/rabbit.png';
let outImgPath = 'D:/jData/rabbit_adjusted.png';

Jimp.read(inImgPath).then(image => {
    let w = image.getWidth();
    let h = image.getHeight();

    for (let x = 0; x < w; x++){
        for (let y = 0; y < h; y++){
            let hexColour = image.getPixelColour(x, y);
            let colourObj = Jimp.intToRGBA(hexColour);
            
            let filterVal1 = 150;
            let filter1 = (colourObj.r < filterVal1 & colourObj.g < filterVal1 & colourObj.b < filterVal1);

            if(filter1){
                image.setPixelColour(Jimp.rgbaToInt(10, 10, 10, 255), x, y);
            } else {
                image.setPixelColour(Jimp.rgbaToInt(255, 255, 255, 255), x, y);
            }
        }
    }

    image.write(outImgPath, () => {
        console.log("done");
    });
});