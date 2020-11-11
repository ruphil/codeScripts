const Jimp = require('jimp');
const robot = require('robotjs');

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

let outDir = 'D:/jData/bookPages/';
let width = robot.getScreenSize().width;
let height = robot.getScreenSize().height;
let pageNo = 1;

setInterval(function(){
    doAction();
}, 3000);

// doAction();

function doAction(){
    robot.keyTap("right");
    
    console.log(width, height);
    let pagePath = outDir + "Page_" + pageNo.pad(4) + ".png";

    let img = robot.screen.capture(500, 0, 500, 650);
    let imgW = img.width;
    let imgH = img.height;
    // console.log(imgW, imgH);
    let imgBuf = img.image;

    new Jimp({ data: imgBuf, width: imgW, height: imgH }, (err, image) => {
        image.write(pagePath);
    });

    pageNo++;
}