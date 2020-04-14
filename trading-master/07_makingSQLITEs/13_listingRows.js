const sqlite3 = require('sqlite3').verbose()

const tData = 'D:/tData/';
const tRawFilesPath = tData + 'tRawFiles/';
const dbPath = tData + 'tStock.db';

var db = new sqlite3.Database(dbPath);

db.all(`SELECT * FROM Table_ASAL_EQ`, [], (err, rows) => {
    rows.forEach((row) => {
      console.log(row)
    })
})

  
db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Closed the database connection.')
})