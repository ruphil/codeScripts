const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {google} = require('googleapis');
const fs = require('fs');
const moment = require('moment');
const StreamZip = require('node-stream-zip');
const sqlite3 = require('sqlite3').verbose();

const privatekey = require('../../token.json');

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
);

const tBasePath = "D:/jData/tBasePath/";
const tFilesPath = tBasePath + 'tFiles/';
const sheetID = "1jahrl-ZQnYwhCZSFXWRd7U94c7oVuY_2HOcnPEduUsA";
const folderID = "1UHNHdAd69BEMcurFHpKrGtT-hwFZQIt3";
const dbPath = tBasePath + 'tStock.db';

if(!fs.existsSync(tBasePath)){
  fs.mkdirSync(tBasePath);
}

if(!fs.existsSync(tFilesPath)){
  fs.mkdirSync(tFilesPath);
}

let tStockDB = new sqlite3.Database(dbPath);
let tableCreateQuery = `CREATE TABLE IF NOT EXISTS tVariables (
  variable_name TEXT PRIMARY KEY,
  variable_value TEXT NOT NULL
); INSERT OR IGNORE INTO tVariables (variable_name, variable_value) VALUES ('lastUpdate', '2000$12$31')`;

tStockDB.exec(tableCreateQuery);

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let socket;
let totalBhavCopies = 0;
io.on('connection', function(sckt){
  socket = sckt;

  // Getting Started Scripts -----------------------------------------------------
  socket.on('getBhavCopiesInfo', function(){
    google.sheets('v4').spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: sheetID,
      range: 'tFiles!A1:B'
    }).then(function(response){
      let tFilesFromSheet = response.data.values;

      let tFilesLocal = fs.readdirSync(tFilesPath);
      
      missingArray = [];
      totalBhavCopies = 0;
      for (let i = 0; i < tFilesFromSheet.length; i++) {
        const tFileSheet = tFilesFromSheet[i];
        const dateIndex = tFileSheet[0];
        const whetherFileAvailable = (tFileSheet[1] == 'downloaded I Suppose') ? true : false;

        let currentDate = moment(dateIndex, "YYYY$MM$DD");

        let fileName = currentDate.format("[cm]DD");
        fileName += currentDate.format("MMM").toUpperCase();
        fileName += currentDate.format("YYYY[bhav.csv.zip]");
        
        if(whetherFileAvailable && !tFilesLocal.includes(fileName)){
          missingArray.push(fileName);
        }

        if(whetherFileAvailable){
          totalBhavCopies++;
        }
      }

      socket.emit("bhavCopiesInfo", [totalBhavCopies, missingArray]);
      
    });
  });

  socket.on('downloadMissingBhavcopies', function(missArry){
    missingArray = missArry;
    socket.emit("putMsgToGettingStartedConsole", "Starting To Get Files List From GDrive...");
    getFilesListNDownload();
  });

  socket.on('getSQLITEInfo', function(){
    tStockDB.get("SELECT variable_value value FROM tVariables WHERE variable_name = 'lastUpdate'", (err, row)=>{
      socket.emit("putMsgToGettingStartedConsole", "SQLITE Last Update Date: " + row.value.replace(/\$/g, '-'));
    });
  });

  socket.on('updateDatabase', function(){
    socket.emit("putMsgToGettingStartedConsole", "Updating Database...");
    updateDatabase();
  });

});

http.listen(3000, function(){
  console.log('App listening on *:3000');
});


// Getting Started Scripts -----------------------------------------------------
let tFilesList = [];
let nextPgToken = '';
let missingArray = [];
function getFilesListNDownload(){
  google.drive('v3').files.list({
    auth: jwtClient,
    q: `'${folderID}' in parents`,
    fields: 'nextPageToken, files(id, name)',
    pageSize: 1000,
    pageToken: nextPgToken,
    spaces: 'drive'
    }, function (_, response) {
      let responseFiles = response.data.files;
      // console.log("Response Files Length: ", responseFiles.length);
      
      tFilesList.push(...responseFiles);
      // console.log("Current FileNames Length: ", fileNames.length);

      nextPgToken = response.data.nextPageToken;
      // console.log("Next Page Token: ", nextPgToken);

      if (nextPgToken != undefined){
        getFilesListNDownload();
      } else {
        socket.emit("putMsgToGettingStartedConsole", "Got Files List From GDrive...");
        startDownloadingMissingBhavCopies();
      }
    }
  );
}

let fileInfos = [];
function startDownloadingMissingBhavCopies(){
  for (let i = 0; i < tFilesList.length; i++) {
    const tFileName = tFilesList[i].name;

    if(missingArray.includes(tFileName)){
      fileInfos.push([tFileName, tFilesList[i].id]);
    }
  }

  if(fileInfos.length == 0){
    socket.emit("putMsgToGettingStartedConsole", "All Seems To Be Downloaded...");
    return;
  }
  socket.emit("putMsgToGettingStartedConsole", "Starting To Download Files Now...");
  downloadFilesFromGDriveSlowly();
}

const drive = google.drive({
  version: 'v3',
  auth: jwtClient,
});

function downloadFilesFromGDriveSlowly(){
  if(fileInfos.length == 0){
    socket.emit("putMsgToGettingStartedConsole", "Downloading Files Completed...");
    return;
  } else {
    let fileName = fileInfos[0][0];
    let fileID = fileInfos[0][1];

    drive.files.get(
      {fileId: fileID, alt: 'media'},
      {responseType: 'stream'}
    ).then(res => {
      let dest = fs.createWriteStream(tFilesPath + fileName);
      res.data.pipe(dest);

      let msg = fileName + ' Downloaded N Written... Another ' + (fileInfos.length - 1) + ' files to download...';

      socket.emit("putMsgToGettingStartedConsole", msg);

      fileInfos.splice(0, 1);
      downloadFilesFromGDriveSlowly();
    });
  }
}

let fieldObj = {};
let csvRows = [];
let tableArrayFromCSV = [];
let currentDateDBInsert = moment();
function updateDatabase(){
  tStockDB.get("SELECT variable_value value FROM tVariables WHERE variable_name = 'lastUpdate'", (err, row)=>{
    let lastUpdateDate = moment(row.value, "YYYY$MM$DD");

    currentDateDBInsert = lastUpdateDate.add(1, 'day');
    readCSVNStartInserting();
  });
}

function readCSVNStartInserting(){
  let fileName = currentDateDBInsert.format("[cm]DD");
  fileName += currentDateDBInsert.format("MMM").toUpperCase();
  fileName += currentDateDBInsert.format("YYYY[bhav.csv.zip]");

  let filePath = tFilesPath + fileName;
  if(fs.existsSync(filePath)){
    let fileCSV = fileName.replace(".zip", "");
    // console.log(fileCSV);

    const zip = new StreamZip({
        file: filePath,
        storeEntries: true
    });

    zip.on('ready', () => {
        let dataCSV = zip.entryDataSync(fileCSV);
        zip.close();
        csvRows = dataCSV.toString().split("\n");
        // console.log(csvRows);
        readFirstLineNMakeFieldObj();
    });
  } else {
    currentDateDBInsert.add(1, 'day');
    if(currentDateDBInsert < moment()){
      readCSVNStartInserting();
    }
  }
}

function readFirstLineNMakeFieldObj(){
  headerRow = csvRows[0].split(",");
  // console.log(headerRow);

  let tableFields = ['SYMBOL', 'SERIES', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'LAST', 'PREVCLOSE', 'TOTTRDQTY', 'TOTTRDVAL', 'TIMESTAMP', 'TOTALTRADES', 'ISIN'];
  for (let i = 0; i < tableFields.length; i++){
    for (let j = 0; j < headerRow.length; j++){
      if (tableFields[i] == headerRow[j]){
          fieldObj[tableFields[i]] = j;
      }
    }
  }
  // console.log(fieldObj);

  tableInsertionPass = 1;
  insertTablesFromCSV();
}

function insertTablesFromCSV(){
  let tableCreateQuery = '';
  for(var i = 1; i < csvRows.length; i++){
    let eachRow = csvRows[i].split(",");
    let symbol = eachRow[fieldObj['SYMBOL']];
    let series = eachRow[fieldObj['SERIES']];
    let tableName = "Table_" + symbol + "_" + series;
    tableArrayFromCSV.push(tableName);

    tableCreateQuery += `CREATE TABLE IF NOT EXISTS [${tableName}] (
        DATE TEXT PRIMARY KEY,
        SERIES TEXT NOT NULL,
        OPEN TEXT NOT NULL,
        HIGH TEXT NOT NULL,
        LOW TEXT NOT NULL,
        CLOSE TEXT NOT NULL,
        LAST TEXT NOT NULL,
        PREVCLOSE TEXT NOT NULL,
        TOTTRDQTY TEXT NOT NULL,
        TOTTRDVAL TEXT NOT NULL,
        TIMESTAMP TEXT NOT NULL,
        TOTALTRADES TEXT,
        ISIN TEXT
    );`;
  }
  // console.log(tableCreateQuery);

  tStockDB.exec(tableCreateQuery, function(err){
    // console.log(err);
    let tablesArrayFromSQL = [];
    tStockDB.all(`SELECT name FROM sqlite_master WHERE type = 'table'`, [], (_, rows) => {
      rows.forEach((row) => {
          tablesArrayFromSQL.push(row.name);
      });
      
      let containsTable = whetherContainsAllCSVTables(tablesArrayFromSQL);
      if(containsTable){
          let msg = currentDateDBInsert.format('YYYY-MM-DD: ') + "All Tables Successfully Inserted... Now Inserting Rows...";
          socket.emit("putMsgToGettingStartedConsole", msg);
          insertRowsFromCSV();
      } else {
          let msg = "Could Not Insert All Tables...";
          socket.emit("putMsgToGettingStartedConsole", msg);
      }
    });
  });
}

function whetherContainsAllCSVTables(tablesArrayFromSQL){
  return tableArrayFromCSV.every(val => tablesArrayFromSQL.includes(val));
}

function insertRowsFromCSV(){
  let rowsInsertQuery = "";
  for(let i = 1; i < csvRows.length; i++){
    let eachRow = csvRows[i].split(",")
    // console.log(eachRow)

    let symbol = eachRow[fieldObj['SYMBOL']]
    let series = eachRow[fieldObj['SERIES']]
    if(symbol != null && series != null){
      let tableName = "Table_" + symbol + "_" + series
      let DATE = eachRow[fieldObj['TIMESTAMP']]
      let queryPart1 = "INSERT OR IGNORE INTO [" + tableName + "] (DATE";
      let queryPart2 = ") VALUES('" + DATE + "'";

      for(let field in fieldObj){
          if (field != 'SYMBOL'){
              queryPart1 += ", " + field;
              queryPart2 += ", '" + eachRow[fieldObj[field]] + "'";
          }
      }

      rowsInsertQuery += queryPart1 + queryPart2 + "); ";
    }
  }
  // console.log(insertQuery);
  tStockDB.exec(rowsInsertQuery, function(err){
    if (err) {
      let msg = "Got Some Error: " + err.message;
      socket.emit("putMsgToGettingStartedConsole", msg);
    } else {
      let msg = currentDateDBInsert.format('YYYY-MM-DD: ') + "All Rows Inserted Successfully... Another " + moment().diff(currentDateDBInsert, 'days') + " days left...";
      socket.emit("putMsgToGettingStartedConsole", msg);
      
      updateLastDateInDB(currentDateDBInsert);
      currentDateDBInsert.add(1, 'day');
      if(currentDateDBInsert < moment()){
        readCSVNStartInserting();
      }
    }
  });
}

function updateLastDateInDB(date){
  let value = date.format("YYYY$MM$DD");
  let query = `UPDATE tVariables SET variable_value = '${value}' WHERE variable_name = 'lastUpdate';`;
  tStockDB.exec(query);
}
