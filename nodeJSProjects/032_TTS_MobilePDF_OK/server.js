var connect = require('connect');
var serveStatic = require('serve-static');
const open = require('open');

console.log(__dirname);

connect()
    .use(serveStatic(__dirname))
    .listen(3000, () => {
        console.log('Server running on http://localhost:3000');
        open('http://localhost:3000');
    });