const sqlite3 = require('sqlite3').verbose();

const tData = 'D:/tData/';
const tRawFilesPath = tData + 'tRawFiles/';
const dbPath = tData + 'tStock.db';

var db = new sqlite3.Database(dbPath);

var tableCreateQuery = '';
for (var i = 0; i < 100; i++){
    tableCreateQuery += `CREATE TABLE IF NOT EXISTS Table_${i} (
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

db.exec(tableCreateQuery, function(_){
    console.log("done");
});

// var tableCreateQuery = `CREATE TABLE IF NOT EXISTS rask (
//     DATE TEXT PRIMARY KEY,
//     SERIES TEXT NOT NULL,
//     OPEN TEXT NOT NULL,
//     HIGH TEXT NOT NULL,
//     LOW TEXT NOT NULL,
//     CLOSE TEXT NOT NULL,
//     LAST TEXT NOT NULL,
//     PREVCLOSE TEXT NOT NULL,
//     TOTTRDQTY TEXT NOT NULL,
//     TOTTRDVAL TEXT NOT NULL,
//     TIMESTAMP TEXT NOT NULL,
//     TOTALTRADES TEXT,
//     ISIN TEXT
// );
// CREATE TABLE IF NOT EXISTS pasc (
//     DATE TEXT PRIMARY KEY,
//     SERIES TEXT NOT NULL,
//     OPEN TEXT NOT NULL,
//     HIGH TEXT NOT NULL,
//     LOW TEXT NOT NULL,
//     CLOSE TEXT NOT NULL,
//     LAST TEXT NOT NULL,
//     PREVCLOSE TEXT NOT NULL,
//     TOTTRDQTY TEXT NOT NULL,
//     TOTTRDVAL TEXT NOT NULL,
//     TIMESTAMP TEXT NOT NULL,
//     TOTALTRADES TEXT,
//     ISIN TEXT
// );`

// db.exec(tableCreateQuery);