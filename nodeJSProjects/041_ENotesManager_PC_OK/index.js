const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const { spawnSync} = require('child_process');

const notesBasePath = "C:/Users/rukmangadan/Documents/GitHub/eNotesCivilServices/";
// const notesBasePath = "D:/jData/eNotesCivilServices/";

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('loadNotes', function(data){
        let fileName = data[0];
        let pageNo = data[1];

        let notesPath = notesBasePath + fileName + "/";
        let currentPagePath = notesPath + pageNo + '.json';
        // console.log(notesPath);

        if(fs.existsSync(notesPath)){
          if(fs.existsSync(currentPagePath)){
            let currentPageContent = fs.readFileSync(currentPagePath, 'utf-8');
            socket.emit("handleNotes", currentPageContent);
          } else {
            fs.writeFileSync(currentPagePath, JSON.stringify({}));
            socket.emit("noNotes", "");
          }
        } else {
          fs.mkdirSync(notesPath);
          fs.writeFileSync(currentPagePath, JSON.stringify({}));
          socket.emit("noNotes", "");
        }
    });

    socket.on('updateNotes', function(noteData){
      var fileName = noteData[0];
      var pageNo = noteData[1];
      var notesJSONStr = noteData[2];

      let notesPath = notesBasePath + fileName + "/";
      let currentPagePath = notesPath + pageNo + '.json';

      fs.writeFileSync(currentPagePath, notesJSONStr);

      socket.emit("handleNotes", notesJSONStr);
    });

    socket.on('commitNPush', function(data){
      let token = fs.readFileSync('../tokengit.txt', "utf-8").replace(/(\r\n|\n|\r)/gm, "");

      let folderPath = notesBasePath;
      let url = `https://ruphil:${token}@github.com/ruphil/eNotesCivilServices.git`;
      // console.log(folderPath, url);

      spawnSync('git', ['-C', folderPath, 'add', './*']);
      spawnSync('git', ['-C', folderPath, 'commit', '-a', '-m', 'auto']);
      spawnSync('git', ['-C', folderPath, 'remote', 'set-url', 'origin', url]);
      spawnSync('git', ['-C', folderPath, 'push']);

      console.log("May Have Committed / Pushed");
    });
});

http.listen(3000, function(){
  console.log('App listening on *:3000');
});
