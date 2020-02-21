function printseq(nQuery, tabID, io){
    var param1 = parseInt(nQuery.split(' ')[1]);

    function timeout() {
        if(param1--){
            setTimeout(function () {
                
                io.emit('nResponseNtabID', [param1, tabID]);
                io.emit('appendStatus', [`processed ${param1}`, tabID])

                timeout();
            }, 2000);
        } else {
            io.emit('overrideStatus', ['Timing is over', tabID]);
            io.emit('nResponseEnd', tabID);
        }
    }

    timeout();
}

module.exports = {
    printseq
}