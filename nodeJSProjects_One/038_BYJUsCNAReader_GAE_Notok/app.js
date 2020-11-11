const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const superagent = require('superagent');
const cheerio = require('cheerio');

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('loadPage', function(url){
    superagent.get(encodeURI(url)).then((resp)=>{
      let $ = cheerio.load(resp.text);

      // let mainDiv = $('body > div.wrapper > div.container > div > div.col-sm-7.col-md-8 > div > div');
      let mainDiv = $('body > div.wrapper > div.container > div').html();

      socket.emit("handlePage", mainDiv);
    });
  });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});