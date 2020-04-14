const sqlite3 = require('sqlite3').verbose()

var dateStr = "05-03-2020"
var fileName = "jack.zip"

addFileNameNDate(dateStr, fileName)

function addFileNameNDate(dateStr, fileName){
  let db = new sqlite3.Database('./databases/fileNamesForDates.db')
  db.run(`INSERT INTO fileNamesForDates(date, file_name) VALUES(?, ?)`, [dateStr, fileName], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.close()
}
