// Not suitable for recording video

const screenshot = require('screenshot-desktop')

var shotsCounter = 1

function takeScreenshot(){
    screenshot({
        filename: `D://jData/${pad(shotsCounter, 5)}.png`
    }).then(() => {
        if (shotsCounter % 10 == 0){
            console.log(shotsCounter + " shots taken");
        }
        
        shotsCounter++
    });
}

var shotInterval = setInterval(takeScreenshot, 40)

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
