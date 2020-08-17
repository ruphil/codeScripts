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
let tableCreateQuery = `
CREATE TABLE IF NOT EXISTS tStockDataTable (
  IDSYMBOLDATE TEXT PRIMARY KEY,
  SYMBOL TEXT NOT NULL,
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
);
CREATE TABLE IF NOT EXISTS tBhavcopies (
  BHAVCOPY_FILENAME TEXT PRIMARY KEY
);`;

tStockDB.exec(tableCreateQuery);

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let socket;
let totalBhavCopies = 0;
io.on('connection', function(sckt){
  socket = sckt;

  // Getting Started Socket Scripts -----------------------------------------------------
  // Getting Started Socket Scripts -----------------------------------------------------
  // Getting Started Socket Scripts -----------------------------------------------------
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
    tStockDB.all("SELECT BHAVCOPY_FILENAME filename FROM tBhavcopies", (err, rows)=>{
      if (err) {
        throw err;
      }

      let bhavCopiesInSQL = [];
      rows.forEach((row) => {
        bhavCopiesInSQL.push(row.filename);
      });

      let tFilesLocal = fs.readdirSync(tFilesPath);
      let missingFilesNumber = 0;
      for (let i = 0; i < tFilesLocal.length; i++){
        if(!bhavCopiesInSQL.includes(tFilesLocal[i])){
          missingFilesNumber++;
        }
      }

      socket.emit("putMsgToGettingStartedConsole", "Number of Missing Files: " + missingFilesNumber);
    });
  });

  socket.on('updateDatabase', function(){
    socket.emit("putMsgToGettingStartedConsole", "Updating Database...");
    updateDatabase();
  });

  socket.on('checkZIPFilenames', function(){
    socket.emit("putMsgToGettingStartedConsole", "Checking ZIP Filenames...");
    checkZIPFilenames();
  })

  socket.on('checkValidZipFiles', function(){
    socket.emit("putMsgToGettingStartedConsole", "Checking Valid ZIP Files...");
    checkValidZipFiles();
  });

  // Chart Playground ---------------------------------------------------------------
  // Chart Playground ---------------------------------------------------------------
  // Chart Playground ---------------------------------------------------------------

  socket.on('getAllStockSymbols', function(){
    tStockDB.all("SELECT DISTINCT SYMBOL symbol FROM tStockDataTable", (err, rows)=>{
      if (err) {
        throw err;
      }

      socket.emit("getAllStockSymbols", rows.length);
    });
  });
});

http.listen(3000, function(){
  console.log('App listening on *:3000');
});


// Getting Started Function Scripts -----------------------------------------------------
// Getting Started Function Scripts -----------------------------------------------------
// Getting Started Function Scripts -----------------------------------------------------
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

let tFilesMissing = [];
function updateDatabase(){
  tStockDB.all("SELECT BHAVCOPY_FILENAME filename FROM tBhavcopies", (err, rows)=>{
    if (err) {
      throw err;
    }

    let bhavCopiesInSQL = [];
    rows.forEach((row) => {
      bhavCopiesInSQL.push(row.filename);
    });

    tFilesMissing = [];
    let tFilesLocal = fs.readdirSync(tFilesPath);
    for (let i = 0; i < tFilesLocal.length; i++){
      if(!bhavCopiesInSQL.includes(tFilesLocal[i])){
        tFilesMissing.push(tFilesLocal[i]);
      }
    }
    // console.log(tFilesMissing);
    if(tFilesMissing.length != 0){
      // console.log(tFilesMissing);
      readCSVNStartInserting();
    } else {
      let msg = "All Bhavcopies Updated into Database Already";
      socket.emit("putMsgToGettingStartedConsole", msg);
    }
  });
}

let csvRows = [];
let tFileCurrentIndex = 0;
let currentFileName = "";
function readCSVNStartInserting(){
  let fileName = tFilesMissing[tFileCurrentIndex];
  currentFileName = fileName;
  let filePath = tFilesPath + fileName;
  let fileCSV = fileName.replace(".zip", "");
  // console.log(filePath, fileCSV);

  const zip = new StreamZip({
      file: filePath,
      storeEntries: true
  });

  zip.on('ready', () => {
      let dataCSV = zip.entryDataSync(fileCSV);
      zip.close();
      csvRows = dataCSV.toString().split("\n");
      csvRows = csvRows.filter(row => row.length !== 0);
      // console.log(csvRows.length);
      readFirstLineNMakeFieldObj();
  });
}

let tableFields = ['SYMBOL', 'SERIES', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'LAST', 'PREVCLOSE', 'TOTTRDQTY', 'TOTTRDVAL', 'TIMESTAMP', 'TOTALTRADES', 'ISIN'];
let tableFieldsAvailArry = [];
function readFirstLineNMakeFieldObj(){
  let headerRow = csvRows[0].split(",");
  // console.log(headerRow);
  
  for (let i = 0; i < tableFields.length; i++){
    tableFieldsAvailArry.push(headerRow.indexOf(tableFields[i]));
  }
  // console.log(tableFieldsAvailArry);

  insertRowsFromCSV();
}

let rowsInsertData = [];
let fileNames_rowsInsertData = [];
function insertRowsFromCSV(){
  for(let i = 1; i < csvRows.length; i++){
    let eachRowData = [];
    let eachRow = csvRows[i].split(",");
    // console.log(eachRow);

    for (let i = 0; i < tableFields.length; i++){
      if(tableFieldsAvailArry[i] >= 0){
        eachRowData.push(eachRow[tableFieldsAvailArry[i]]);
      } else {
        eachRowData.push("");
      }
    }

    let symbol = eachRowData[0];
    let series = eachRowData[1];
    let DATE = eachRowData[10];
    let IDSYMBOLDATE = "Id-" + symbol + "-" + series + "-" + DATE;
    eachRowData.unshift(IDSYMBOLDATE);

    // console.log(eachRowData);
    rowsInsertData.push(eachRowData);
  }
  // console.log(rowsInsertData);
  // console.log(rowsInsertData.length, (tFileCurrentIndex + 1) + " of " + tFilesMissing.length);
  
  fileNames_rowsInsertData.push(currentFileName);

  if((tFileCurrentIndex + 1) % 50 == 0 || (tFileCurrentIndex + 1) == tFilesMissing.length){
    updateDataBaseNFlush();
  }

  tFileCurrentIndex++;
  // console.log(tFileCurrentIndex, tFilesMissing.length);
  if(tFileCurrentIndex < tFilesMissing.length && commitingToDatabase == false){
    readCSVNStartInserting();
  }
}

let commitingToDatabase = false;
function updateDataBaseNFlush(){
  let rowsInsertQuery = "INSERT INTO tStockDataTable (IDSYMBOLDATE, SYMBOL, SERIES, OPEN, HIGH, LOW, CLOSE, LAST, PREVCLOSE, TOTTRDQTY, TOTTRDVAL, TIMESTAMP, TOTALTRADES, ISIN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  commitingToDatabase = true;

  let temprowsInsertData = rowsInsertData;
  tStockDB.serialize(function() {
    tStockDB.run("BEGIN TRANSACTION;");

    for(let i = 0; i < temprowsInsertData.length; i++){
      tStockDB.run(rowsInsertQuery, temprowsInsertData[i]);
    }

    tStockDB.run("COMMIT;", function(){
      updateFileNames(fileNames_rowsInsertData);

      rowsInsertData = [];
      fileNames_rowsInsertData = [];

      commitingToDatabase = false;
      let msg = tFileCurrentIndex + " files of " + tFilesMissing.length + " Files Updated In Database";
      socket.emit("putMsgToGettingStartedConsole", msg);

      if(tFileCurrentIndex < tFilesMissing.length){
        readCSVNStartInserting();
      }
    });
  });
}

function updateFileNames(fileNames){
  let filesInsertQuery = "INSERT INTO tBhavcopies (BHAVCOPY_FILENAME) VALUES (?)";

  tStockDB.serialize(function() {
    tStockDB.run("BEGIN TRANSACTION;");

    for(let i = 0; i < fileNames.length; i++){
      tStockDB.run(filesInsertQuery, fileNames[i]);
    }

    tStockDB.run("COMMIT;");
  });
}

function checkZIPFilenames(){
  let fileNames = fs.readdirSync(tFilesPath);
  fileNames.forEach(function(fileName){
    // cm01APR2001bhav.csv.zip
    let regex = RegExp('cm[0-9]{2}[A-Z]{3}[0-9]{4}bhav.csv.zip','g');
    if(!regex.test(fileName)){
      let msg = fileName + " Not Following Standard Name Format";
      socket.emit("putMsgToGettingStartedConsole", msg);
    }
  });

  let msg = "All Zip Files Checked for Standard Name Format";
  socket.emit("putMsgToGettingStartedConsole", msg);
}

let totalZipFiles = [];
let totalZipFilesCurrentIndex = 0;
function checkValidZipFiles(){
  totalZipFiles = fs.readdirSync(tFilesPath);
  checkEachZipFile();
}

function checkEachZipFile(){
  let fileName = totalZipFiles[totalZipFilesCurrentIndex];

  let fileCSV = fileName.replace(".zip", "");
  let filePath = tFilesPath + fileName;

  const zip = new StreamZip({
    file: filePath,
    storeEntries: true
  });

  zip.on('error', err => {
    let msg = "File: " + fileName + ". Possible Error: " + err;
    socket.emit("putMsgToGettingStartedConsole", msg);

    totalZipFilesCurrentIndex++;
    if(totalZipFilesCurrentIndex < totalZipFiles.length){
      if(totalZipFilesCurrentIndex % 1000 == 0 || (totalZipFilesCurrentIndex + 1) == totalZipFiles.length){
        let msg = (totalZipFilesCurrentIndex + 1) + " files of " + totalZipFiles.length + " Files are Checked For ZIP Validity";
        socket.emit("putMsgToGettingStartedConsole", msg);
      }
      checkEachZipFile();
    }
  });

  zip.on('ready', () => {
      zip.close();
      
      totalZipFilesCurrentIndex++;
      if(totalZipFilesCurrentIndex < totalZipFiles.length){
        if(totalZipFilesCurrentIndex % 1000 == 0 || (totalZipFilesCurrentIndex + 1) == totalZipFiles.length){
          let msg = (totalZipFilesCurrentIndex + 1) + " files of " + totalZipFiles.length + " Files are Checked For ZIP Validity";
          socket.emit("putMsgToGettingStartedConsole", msg);
        }
        checkEachZipFile();
      }
  });
}

// Chart Playground ---------------------------------------------------------------
// Chart Playground ---------------------------------------------------------------
// Chart Playground ---------------------------------------------------------------