const fs = require('fs');


var ordering = fs.readFileSync('./ordering.txt', 'utf-8');

console.log(ordering)