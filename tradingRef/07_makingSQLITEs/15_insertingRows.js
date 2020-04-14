const sqlite3 = require('sqlite3').verbose();

const tData = 'D:/tData/';
const tRawFilesPath = tData + 'tRawFiles/';
const dbPath = tData + 'tStock.db';

var db = new sqlite3.Database(dbPath);

var rowsInsertQuery = `INSERT INTO Table_ASAL_EQ (DATE, SERIES, OPEN, HIGH, LOW, CLOSE, LAST, PREVCLOSE, TOTTRDQTY, TOTTRDVAL, TIMESTAMP, TOTALTRADES, ISIN) 
    VALUES('31-OCT-2014', 'EQ', 
    '18.75', '19', '17.55', '18.2', '18.9', '18.45', 
    '12388', '223523.5', '31-OCT-2014','77', 'INE326B01027');`;


db.exec(rowsInsertQuery, function(_){
    console.log("done");
});