const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./databases/fileNamesForDates.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the test database.');
});

db.run(`DROP TABLE  fileNamesForDates`);

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

db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
});