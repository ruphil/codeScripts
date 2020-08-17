const fs = require("fs");

var argPath = process.cwd() + (process.argv[2]).replace(".", "");
console.log(argPath);
console.log(fs.existsSync(argPath));

// console.log(process.cwd());
// console.log(process.argv[2]);

// var path = require('path');
// console.log(path.resolve(process.cwd(), '..'));

// console.log(process.argv.slice(2));

// console.log(process.argv);

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });