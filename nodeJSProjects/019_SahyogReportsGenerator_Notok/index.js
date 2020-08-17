const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('csvData', function(csvData){
    console.log(csvData);

  });

  socket.on('getAPIKey', function(){
    socket.emit("apikey", fs.readFileSync("C:/Users/rukmangadan/Documents/GitHub/apikey.txt", "utf-8"));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});