function defaultRoute(nQuery, tabID, io){
    var command = nQuery.split(' ')[0];
    var nResponse = "The command <b>'" + command + "'</b> does not exist";
    io.emit('nResponseNtabID', [nResponse, tabID]);
    io.emit('overrideStatus', ['Sorry, Dear', tabID]);
    io.emit('nResponseEnd', tabID);
}

module.exports = {
    defaultRoute
}