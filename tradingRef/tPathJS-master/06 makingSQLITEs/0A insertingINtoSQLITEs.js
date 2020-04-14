const StreamZip = require('node-stream-zip')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

const tIn = 'D:/tIn/'
const tRawFilesPath = tIn + 'tRawFiles/'

var db = new sqlite3.Database('./databases/tStock.db')

// fs.readdirSync(tRawFilesPath).forEach(file => {
//   console.log(file)
// })

var fileName = "cm31OCT2014bhav.csv.zip"
var filePath = tRawFilesPath + fileName

var fileCSV = fileName.replace(".zip", "")
// console.log(fileCSV)

const zip = new StreamZip({
    file: filePath,
    storeEntries: true
})

zip.on('ready', () => {
    var dataCSV = zip.entryDataSync(fileCSV)
    zip.close()
    readFirstLineNFormFieldObjs(dataCSV.toString().split("\n"))
})

// db.close()

function readFirstLineNFormFieldObjs(csvRows){
    headerRow = csvRows[0].split(",")
    // console.log(headerRow)

    var tableFields = ['SYMBOL', 'SERIES', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'LAST', 'PREVCLOSE', 'TOTTRDQTY', 'TOTTRDVAL', 'TIMESTAMP', 'TOTALTRADES', 'ISIN']
    var fieldObj = {}

    for (var i = 0; i < tableFields.length; i++){
        for (var j = 0; j < headerRow.length; j++){
            if (tableFields[i] == headerRow[j]){
                fieldObj[tableFields[i]] = j
            }
        }
    }

    startPuttingSymbolData(fieldObj, csvRows)
}

function startPuttingSymbolData(fieldObj, csvRows){
    for(var i = 1; i < csvRows.length; i++){
        var eachRow = csvRows[i].split(",")
        // console.log(eachRow)

        var symbol = eachRow[fieldObj['SYMBOL']]
        var tableName = "Table_" + symbol

        var DATE = eachRow[fieldObj['TIMESTAMP']]
        var queryPart1 = "INSERT INTO " + tableName + " (DATE, "
        var queryPart2 = []
        queryPart2.push(DATE)

        for(var field in fieldObj){
            if (field != 'SYMBOL'){
                queryPart1 += field + ", "
                queryPart2.push(eachRow[fieldObj[field]])
            }
        }

        queryPart1 = queryPart1.replace(/,\s*$/, "") + ") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

        console.log(queryPart1, queryPart2)
        // createTableIfNotExistsNInsertData(tableName, queryPart1, queryPart2)

        // if(i == 2){
        //     break
        // }
    }
}

function createTableIfNotExistsNInsertData(tableName, queryPart1, queryPart2){
    var tableCreateQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
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
    )`
    
    db.run(tableCreateQuery, function(){
        // console.log(queryPart1, queryPart2)
        db.run(queryPart1, queryPart2)
    })
    
    
}
