const Jimp = require('jimp');

let inImgPath = 'D:/jData/shapes.bmp';

Jimp.read(inImgPath).then(image => {
    // image = image.scale(0.5);

    let w = image.getWidth();
    let h = image.getHeight();

    let dataPixels = [];

    for (let x = 0; x < w; x++){
        for (let y = 0; y < h; y++){
            let hexColour = image.getPixelColour(x, y);
            let colourObj = Jimp.intToRGBA(hexColour);
            
            let red = colourObj.r;

            if (red != 255){
                dataPixels.push([x, y]);
            }
        }
    }

    let len = dataPixels.length;
    let total = w * h;
    let ratio = len / total;

    console.log(`Data Pixels: ${len}, Total Pixels: ${total}, Ratio: ${ratio.toPrecision(2)}`);

    getDifferentObjects(dataPixels, w, h);
});

function getDifferentObjects(dataPixels, w, h){
    let diffObjectsArr = [];
    
    let createNewObj = true;
    for (let i = 0; i < dataPixels.length; i++) {
        const pixel = dataPixels[i];
        const [IfPixelNotAlreadyInObjects, IfPixelRelatedToObj, PixelRelation] = checkPixel(pixel, diffObjectsArr)
        if(IfPixelNotAlreadyInObjects){


            // let params = checkWhetherPixelRelatedToObjects(objects, pixel);
            // let related = params[0];
            // let relatedTo = params[1];
            // if(related){
            //     // add pixel to relevant obj
            // } else {
            //     // add pixel to new obj
            // }
        }
    }
}

function checkPixel(pixel, objectsArr){
    const pX = pixel[0];
    const pY = pixel[1];
    for (let i = 0; i < objectsArr.length; i++) {
        const object = objectsArr[i];
        for (let j = 0; j < object.length; j++) {
            const objX = object[j][0];
            const objY = object[j][1];
            // checking if Any Object contains this Pixel
            if((objX == pX) && (objY == pY)){
                return [false, null, null];
            } else if ((objX + 1 == pX)) { // checking if This Pixel belongs to Adjacent of Object

            }
        }
    }
    return true;
}


/* Algorithm ---------------------------------------------------------------------------------

* let objects

* getDataPixels

* check if objects does not contain any pixel for one whole loop of datapixels
-> then create new object

* check this is adjacent pixel of any object already present
-> add this pixel to that object

* if for one whole loop, the pixel does not any adjacent pixels
-> then create new object


*/