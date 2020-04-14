
const fs = require('fs')
const https = require('https')

var url = "https://www1.nseindia.com/content/historical/EQUITIES/2017/SEP/cm16SEP2017bhav.csv.zip"
var fileName = url.replace(/^.*[\\\/]/, '')

var chunks = []
https.get(url, function(response) {
    console.log(response.statusCode)
    // response.on('data', function (chunk) {
    //     chunks.push(chunk)
    // })
    
    // response.on('end', function () {
    //     var content = chunks.join("")
    //     console.log(content)
    // })
})