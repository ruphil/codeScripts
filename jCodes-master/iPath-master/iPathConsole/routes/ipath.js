const request = require('request');

const { JSDOM } = require("jsdom");
const { window } = new JSDOM(``, {url: "https://www.nseindia.com/"});

var $ = jQuery = require('jquery')(window);

function ipath(nQuery, tabID, io){
    var param1 = nQuery.split(' ')[1];
    
    var nResponse = '';
    switch(param1) {
        case 'download':
            io.emit('overrideStatus', ['downloading', tabID]);
            break;

        case 'listsyms':
            listsyms(nQuery, tabID, io);
            break;

        case 'getquote':
            getquote(nQuery, tabID, io);
            break;

        default:
            showParamError(param1, tabID, io);
    }
    
    
}

function listsyms(nQuery, tabID, io){
    var source = nQuery.split(' ')[2];
    if (!source) source = 'nse';

    request.post({
        headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
        url:     'https://www.nseindia.com/corporates/listDir/getListDirectEQ.jsp',
        body:    "start=0&limit=1597&listingPeriod=More%20than%205%20Years&segment=EQUITIES"
      }, function(error, response, body){
        io.emit('nResponseNtabID', [body, tabID]);
    });
}

function getquote(nQuery, tabID, io){
    $.ajax({url:'https://www.nseindia.com/live_market/dynaContent/live_watch/get_quote'+'/ajaxGetQuoteJSON.jsp',type:'get',data:{symbol:'SOUTHWEST',series:'EQ'},
    success:function(html){
        io.emit('nResponseNtabID', [html, tabID])
    },async:true})

}

function showParamError(param1, tabID, io){
    var nResponse = "The parameter <b>'" + param1 + "'</b> does not exist";
    io.emit('nResponseNtabID', [nResponse, tabID]);
    io.emit('overrideStatus', ['Try Again, Dear', tabID]);
    io.emit('nResponseEnd', tabID);
}

module.exports = {
    ipath
}
