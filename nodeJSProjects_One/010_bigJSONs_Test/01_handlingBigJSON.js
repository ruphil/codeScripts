const fs = require('fs');
const json = require('big-json');

const jsonPath = 'D:/jData/big.json';

let bigJSON = {};
const stringifyStream = json.createStringifyStream({
    body: bigJSON
});

for (let i = 0; i < 10; i++){
    bigJSON = {};

    bigJSON[i] = "This may be the value of " + i;
}

stringifyStream.on('data', function(strChunk) {
    fs.appendFileSync(jsonPath, strChunk);
});
// console.log(bigJSON);

