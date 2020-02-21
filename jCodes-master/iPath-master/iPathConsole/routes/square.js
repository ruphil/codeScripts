function square(nQuery, tabID, io){
    var param1 = parseInt(nQuery.split(' ')[1]);
    var sqr = param1 * param1;

    io.emit('nResponseNtabID', [sqr, tabID]);
    io.emit('overrideStatus', ['processed', tabID]);
    io.emit('nResponseEnd', tabID);
}

module.exports = {
    square
}