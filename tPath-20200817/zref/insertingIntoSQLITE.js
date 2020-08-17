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
var tableInsertionPass = 1;

const zip = new StreamZip({
    file: filePath,
    storeEntries: true
});

zip.on('ready', () => {
    var dataCSV = zip.entryDataSync(fileCSV);
    zip.close();
    csvRows = dataCSV.toString().split("\n");
    // console.log(csvRows);
    readFirstLineNMakeFieldObj();
});

function readFirstLineNMakeFieldObj(){
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

    insertTablesFromCSV();
}

function insertTablesFromCSV(){
    var tableCreateQuery = '';
    for(var i = 1; i < csvRows.length; i++){
        let eachRow = csvRows[i].split(",");
        let symbol = eachRow[fieldObj['SYMBOL']];
        let series = eachRow[fieldObj['SERIES']];
        let tableName = "Table_" + symbol + "_" + series;
        tableArrayFromCSV.push(tableName);

        tableCreateQuery += `CREATE TABLE IF NOT EXISTS [${tableName}] (
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
        );`;
    }
    // console.log(tableCreateQuery);

    db.exec(tableCreateQuery, function(err){
        // console.log(err);
        var tablesArrayFromSQL = [];
        db.all(`SELECT name FROM sqlite_master WHERE type = 'table'`, [], (_, rows) => {
            rows.forEach((row) => {
                tablesArrayFromSQL.push(row.name);
            });
            
            var containsTable = whetherContainsAllCSVTables(tablesArrayFromSQL);
            if(containsTable){
                console.log("All Tables Successfully Inserted... Now Inserting Rows...");
                insertRowsFromCSV();
            } else {
                console.log("Could Not Insert All Tables...");
                console.log(tableArrayFromCSV.length, tablesArrayFromSQL.length);
                if(tableInsertionPass == 1){
                    insertTablesFromCSV();
                }
                tableInsertionPass++;
            }
        });
    });
}

function whetherContainsAllCSVTables(tablesArrayFromSQL){
    return tableArrayFromCSV.every(val => tablesArrayFromSQL.includes(val));
}

function insertRowsFromCSV(){
    var rowsInsertQuery = "";
    for(var i = 1; i < csvRows.length; i++){
        var eachRow = csvRows[i].split(",")
        // console.log(eachRow)

        var symbol = eachRow[fieldObj['SYMBOL']]
        var series = eachRow[fieldObj['SERIES']]
        if(symbol != null && series != null){
            var tableName = "Table_" + symbol + "_" + series

            var DATE = eachRow[fieldObj['TIMESTAMP']]
            var queryPart1 = "INSERT INTO [" + tableName + "] (DATE";
            var queryPart2 = ") VALUES('" + DATE + "'";

            for(var field in fieldObj){
                if (field != 'SYMBOL'){
                    queryPart1 += ", " + field;
                    queryPart2 += ", '" + eachRow[fieldObj[field]] + "'";
                }
            }

            rowsInsertQuery += queryPart1 + queryPart2 + "); ";
        }
    }
    // console.log(insertQuery);
    db.exec(rowsInsertQuery, function(err){
        if (err) {
            console.log("Got Some Error");
        } else {
            console.log("All Rows Inserted Successfully...");
        }
    });
}