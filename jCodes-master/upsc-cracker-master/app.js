const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const request = require('request');

app.use(express.static(__dirname + '/static'));

var htmlURL = 'https://raw.githubusercontent.com/ruphil/upsc-cracker/master/index.html';

app.get('/', function(req, res) {
    // for development (Comment when uploaded to Google App Engine)
    res.sendFile(path.join(__dirname + '/index.html'));
    
    // for production (Uncomment when uploaded to Google App Engine)
    // request(htmlURL, function(error, response, body){
    //   res.send(body);
    // });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, function(){
  console.log('listening on *: ' + PORT);
});
