const bfj = require('bfj');

const jsonPath = 'D:/jData/bfj.json';

let bigJSON = {};

for (let i = 0; i < 10; i++){
    bigJSON = {
        i: "This may be the value of " + i
    };

    jsonStreamWriter(bigJSON);
}

function jsonStreamWriter(data){
    const stream = bfj.streamify(data, {});
    stream.on('data', chunk => { console.log(chunk) });
}


// bfj.write(jsonPath, bigJSON, {})
// .then(() => {
//     console.log(2);
// });