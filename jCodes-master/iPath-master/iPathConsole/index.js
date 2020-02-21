var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('./router');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('nQueryNtabID', function(nQueryNtabID){
        r.routeIt(nQueryNtabID, io);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
