const Jimp = require('jimp');

let baseDir = 'D:/jData/youtubelabels/';

let youtubeImg = baseDir + 'youtube.png';
let kitchenImg = baseDir + 'kitchen.png';

let tamilImg = baseDir + 'tamil.png';
let englishImg = baseDir + 'english.png';
let hindiImg = baseDir + 'hindi.png';

let language = 'tamil';
let inImgPath = 'D:/jData/food.jpg';
let outImgPath = 'D:/jData/thumnail.png';

Jimp.read(inImgPath).then(image => {
    addYoutubeLogo(image);
});

function addYoutubeLogo(image){
    let iw = image.getWidth();
    let ih = image.getHeight();

    Jimp.read(youtubeImg).then(youtube => {
        let yw = youtube.getWidth();
        let yh = youtube.getHeight();
        let ratio = yw/yh;
        let youtubeHeight = ih * 0.9;

        youtube = youtube.resize(youtubeHeight * ratio, youtubeHeight);

        let offsetWidth = 0.030 * iw;
        let offsetHeight = 0.05 * ih;
        image.composite(youtube, offsetWidth, offsetHeight, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.5
        });
    
        addKitchenLogo(image);
    });
}

function addKitchenLogo(image){
    let iw = image.getWidth();
    let ih = image.getHeight();

    Jimp.read(kitchenImg).then(kitchen => {
        let yw = kitchen.getWidth();
        let yh = kitchen.getHeight();
        let ratio = yw/yh;
        let kitchenHeight = ih * 0.9;

        kitchen = kitchen.resize(kitchenHeight * ratio, kitchenHeight);

        let offsetWidth = 0.85 * iw;
        let offsetHeight = 0.05 * ih;
        image.composite(kitchen, offsetWidth, offsetHeight, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.5
        });
    
        addLanguageLogo(image);
    });
}

function addLanguageLogo(image){
    let iw = image.getWidth();
    let ih = image.getHeight();

    let languageImgPath = `D:/jData/youtubelabels/${language}.png`;
    Jimp.read(languageImgPath).then(language => {
        let yw = language.getWidth();
        let yh = language.getHeight();
        let ratio = yw/yh;
        let languageHeight = ih * 0.10;

        language = language.resize(languageHeight * ratio, languageHeight);

        let offsetWidth = 0.20 * iw;
        let offsetHeight = 0.85 * ih;
        image.composite(language, offsetWidth, offsetHeight, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.7
        });
    
        let finalWidth = 1600;

        image = image.resize(finalWidth, finalWidth / 1.78);
        image.write(outImgPath, () => {
            console.log("done");
        });
    });
}