const StreamZip = require('node-stream-zip');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const tData = 'D:/tData/';
const tRawFilesPath = tData + 'tRawFiles/';
const dbPath = tData + 'tStock.db';

var db = new sqlite3.Database(dbPath);

// fs.readdirSync(tRawFilesPath).forEach(file => {
//   console.log(file);
// });

var fileName = "cm31OCT2014bhav.csv.zip";
var filePath = tRawFilesPath + fileName;

var fileCSV = fileName.replace(".zip", "");
// console.log(fileCSV);
var fieldObj = {};
var csvRows = [];
var tableArrayFromCSV = [];

const zip = new StreamZip({
    file: filePath,
    storeEntries: true
});

zip.on('ready', () => {
    var dataCSV = zip.entryDataSync(fileCSV);
    zip.close();
    csvRows = dataCSV.toString().split("\n");
    // console.log(csvRows);
    readFirstLineNMakeFieldObj(csvRows);
});

function readFirstLineNMakeFieldObj(csvRows){
    headerRow = csvRows[0].split(",");
    // console.log(headerRow);

    var tableFields = ['SYMBOL', 'SERIES', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'LAST', 'PREVCLOSE', 'TOTTRDQTY', 'TOTTRDVAL', 'TIMESTAMP', 'TOTALTRADES', 'ISIN'];

    for (var i = 0; i < tableFields.length; i++){
        for (var j = 0; j < headerRow.length; j++){
            if (tableFields[i] == headerRow[j]){
                fieldObj[tableFields[i]] = j;
            }
        }
    }
    // console.log(fieldObj);

    for(var i = 1; i < csvRows.length; i++){
        let eachRow = csvRows[i].split(",");
        let symbol = eachRow[fieldObj['SYMBOL']];
        let series = eachRow[fieldObj['SERIES']];
        let tableName = "Table_" + symbol + "_" + series;
        tableArrayFromCSV.push(tableName);
    }
    // console.log(tableArrayFromCSV);
    
    compareTablesArrayNInsertTables();
}

function compareTablesArrayNInsertTables(){
    var tablesArrayFromSQL = [];
    db.all(`SELECT name FROM sqlite_master WHERE type = 'table'`, [], (_, rows) => {
        rows.forEach((row) => {
            tablesArrayFromSQL.push(row.name);
        });
        
        var tablesAvailable = compareTablesArray(tablesArrayFromSQL);
        if(tablesAvailable){
            console.log("hey hey");
        } else {
            console.log("ooo ooo");
            console.log(tableArrayFromCSV.length, tablesArrayFromSQL.length);
            insertRemainingTables(tablesArrayFromSQL);
        }
    });
}

function compareTablesArray(tablesArrayFromSQL){
    return tableArrayFromCSV.every(val => tablesArrayFromSQL.includes(val));
}

function insertRemainingTables(tablesArrayFromSQL){
    for(var i = 0; i < tableArrayFromCSV.length; i++){
        let tableName = tableArrayFromCSV[i]
        if(!(tablesArrayFromSQL.includes(tableName))){
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
            )`;
                   
            console.log(tableCreateQuery);
            // db.run(tableCreateQuery);
        }
    }
}

// // function startPuttingSymbolData(fieldObj, csvRows){
// //     for(var i = 1; i < csvRows.length; i++){
// //         var eachRow = csvRows[i].split(",")
// //         // console.log(eachRow)

// //         var symbol = eachRow[fieldObj['SYMBOL']]
// //         var series = eachRow[fieldObj['SERIES']]
// //         if(symbol != null && series != null){
// //             var tableName = "Table_" + symbol + "_" + series

// //             var DATE = eachRow[fieldObj['TIMESTAMP']]
// //             var queryPart1 = "INSERT INTO " + tableName + " (DATE, "
// //             var queryPart2 = []
// //             queryPart2.push(DATE)

// //             for(var field in fieldObj){
// //                 if (field != 'SYMBOL'){
// //                     queryPart1 += field + ", "
// //                     queryPart2.push(eachRow[fieldObj[field]])
// //                 }
// //             }

// //             queryPart1 = queryPart1.replace(/,\s*$/, "") + ") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
// //             // console.log(queryPart1, queryPart2)

// //             setTimeout(createTableIfNotExistsNInsertData, i * 200, tableName, queryPart1, queryPart2)
// //         } else {
// //             console.log(symbol)
// //         }
        
// //     }
// // }

// // function createTableIfNotExistsNInsertData(tableName, queryPart1, queryPart2){
// //     // console.log(queryPart1, queryPart2)
// //     var tableCreateQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
// //         DATE TEXT PRIMARY KEY,
// //         SERIES TEXT NOT NULL,
// //         OPEN TEXT NOT NULL,
// //         HIGH TEXT NOT NULL,
// //         LOW TEXT NOT NULL,
// //         CLOSE TEXT NOT NULL,
// //         LAST TEXT NOT NULL,
// //         PREVCLOSE TEXT NOT NULL,
// //         TOTTRDQTY TEXT NOT NULL,
// //         TOTTRDVAL TEXT NOT NULL,
// //         TIMESTAMP TEXT NOT NULL,
// //         TOTALTRADES TEXT,
// //         ISIN TEXT
// //     )`
    
// //     db.run(tableCreateQuery, function(){
// //         // console.log(tableName, "created")
// //     })
// //     // db.run(tableCreateQuery, function(){
// //     //     console.log(queryPart1, queryPart2)
// //     //     db.run(queryPart1, queryPart2, function(){
// //     //         row++
// //     //         startPuttingSymbolData(row, fieldObj, csvRows)
// //     //     })
// //     // })
// // }

