const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./databases/tStock.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the test database.');
})

db.all(`SELECT * FROM Table_20MICRONS`, [], (err, rows) => {
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