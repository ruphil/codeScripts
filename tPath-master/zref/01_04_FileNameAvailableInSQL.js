const sqlite3 = require('sqlite3').verbose()

function getFileName(dateStr, callback){
  let db = new sqlite3.Database('./databases/fileNamesForDates.db')
  db.all(`SELECT file_name Filename FROM fileNamesForDates WHERE date  = ?`, [dateStr], (_, rows) => {
    callback(rows)
  })

  db.close()
}

function printFileName(data){
  if (data.length > 0){
    console.log("file Available")
  }
}

fileName = getFileName("05-03-2020", printFileName)
// console.log(fileName)
