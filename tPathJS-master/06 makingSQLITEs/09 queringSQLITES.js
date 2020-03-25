const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./databases/fileNamesForDates.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the test database.');
});

var tableCreateQuery = `CREATE TABLE IF NOT EXISTS fileNamesForDates (
  date TEXT PRIMARY KEY,
  file_name TEXT NOT NULL UNIQUE
)`
db.run(tableCreateQuery);

db.all(`SELECT name FROM sqlite_master WHERE type ='table'`, [], (err, rows) => {
  if (err) {
    throw err
  }
  console.log(rows)
});

db.run(`INSERT INTO fileNamesForDates(date, file_name) VALUES(?, ?)`, ['05-03-2020', 'jack.zip'], function(err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.all(`SELECT date Date, file_name Filename FROM fileNamesForDates`, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
})

// db.run(`DROP TABLE  fileNamesForDates`);

db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
});