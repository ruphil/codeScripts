var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('imgData', function(imgData){
        
        var imgID = imgData[0];
        var imgArryBuffer = imgData[1];  
        // console.log(imgArryBuffer);
      
        var location = 'D:/vtTiles/';
        var fileName = 'vt-' + imgID + '.png';

        console.log(fileName);

        var filePath = location + fileName;

        fs.writeFileSync(filePath, imgArryBuffer);

    });

    socket.on('getAPIKey', function(){
      
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
