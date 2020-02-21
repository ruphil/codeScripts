var defaultRoute = require('./routes/defaultRoute');
var square = require('./routes/square');
var printseq = require('./routes/printseq');
var ipath = require('./routes/ipath');

function routeIt(nQueryNtabID, io){
    var nQuery = nQueryNtabID[0];
    var command = nQuery.split(' ')[0];
    var tabID = nQueryNtabID[1];
    switch(command) {
        case 'square':
            square.square(nQuery, tabID, io);
            break;
        
        case 'printseq':
            printseq.printseq(nQuery, tabID, io);
            break;
        
        case 'ipath':
            ipath.ipath(nQuery, tabID, io);
            break;

        default:
            defaultRoute.defaultRoute(nQuery, tabID, io);
    }
}

module.exports = {
    routeIt
}