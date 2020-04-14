const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./databases/tStock.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the test database.');
})

db.all(`SELECT name FROM sqlite_master WHERE type ='table'`, [], (err, rows) => {
  if (err) {
    throw err
  }
  console.log(rows.length)
})

db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
})