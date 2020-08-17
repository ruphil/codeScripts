const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const { spawnSync} = require('child_process');

const gitPath = __dirname;
const mcqsBasePath = gitPath + "/mcqStore/";

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/reader', function(req, res){
  res.sendFile(__dirname + '/reader.html');
});

io.on('connection', function(socket){
  // Home Page - Manager Socket Connections
    socket.on('loadMCQsInfo', function(data){
        let fileName = data[0];

        let infoPath = mcqsBasePath + fileName + ".json";
        // console.log(infoPath);

        if(fs.existsSync(infoPath)){
            let infoJSONStr = fs.readFileSync(infoPath, 'utf-8');
            socket.emit("handleInfo", infoJSONStr);
        } else {
          fs.writeFileSync(infoPath, JSON.stringify([]));
          socket.emit("noInfo", "");
        }
    });

    socket.on('updateInfo', function(noteData){
      var fileName = noteData[0];
      var infoJSONStr = noteData[1];

      let infoPath = mcqsBasePath + fileName + ".json";

      fs.writeFileSync(infoPath, infoJSONStr);

      socket.emit("handleInfo", infoJSONStr);
    });

    socket.on('commitNPush', function(data){
      let token = fs.readFileSync('../tokengit.txt', "utf-8").replace(/(\r\n|\n|\r)/gm, "");

      let folderPath = gitPath;
      let url = `https://ruphil:${token}@github.com/ruphil/PrelimsMCQsManager.git`;
      // console.log(folderPath, url);

      spawnSync('git', ['-C', folderPath, 'add', './*']);
      spawnSync('git', ['-C', folderPath, 'commit', '-a', '-m', 'auto']);
      spawnSync('git', ['-C', folderPath, 'remote', 'set-url', 'origin', url]);
      spawnSync('git', ['-C', folderPath, 'pull', 'origin', 'master']);
      spawnSync('git', ['-C', folderPath, 'push']);

      console.log("May Have Committed / Pushed");
    });

    // MCQs Reader Socket Connections
    socket.on('loadMCQsList', function(data){
      socket.emit('MCQsList', fs.readdirSync(mcqsBasePath));
    });

    socket.on('loadMCQJSON', function(fileName){
      let infoJSONStr = fs.readFileSync(mcqsBasePath + fileName, 'utf-8');
      socket.emit("handleJSONMCQs", infoJSONStr);
    });
});

http.listen(3000, function(){
  console.log('App listening on *:3000');
});
