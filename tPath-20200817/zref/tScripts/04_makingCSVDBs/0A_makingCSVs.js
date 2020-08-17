// Requires ----------------------------------------------------------------------------------
const StreamZip = require('node-stream-zip');
const fs = require('fs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

// Main Class ----------------------------------------------------------------------------------
class dataCSV{
    constructor(baseDir, startDate, endDate){
        this.baseDir = baseDir;
        this.startDate = dayjs(startDate, "YYYY/MM/DD");
        this.endDate = dayjs(endDate, "YYYY/MM/DD");
        this.currentDate = dayjs(startDate, "YYYY/MM/DD");
    }

    checkWhetherToProceed(){
        let nextUpdateDateVar = this.baseDir + "tData/tVariables/NextUpdateDate.var";
        if(fs.existsSync(nextUpdateDateVar)){
            this.currentDate = dayjs(fs.readFileSync(nextUpdateDateVar, "utf-8"),  "YYYY/MM/DD");
        } 
        
        return this.currentDate <= this.endDate ? true: false;
    }

    makeDateWiseZipName(){
        let dayjsInst = this.currentDate;
        this.zipName = dayjsInst.format("[cm]DD") + dayjsInst.format('MMM').toUpperCase() + dayjsInst.format("YYYY[bhav.csv.zip]");
    }

    checkIfZIPExists(){
        let zipPath = this.baseDir + "tData/tRawFiles/" + this.zipName;
        return fs.existsSync(zipPath) ? true: false;
    }

    getCSVFileFromZIP(){
        let zipPath = this.baseDir + "tData/tRawFiles/" + this.zipName;
        let fileCSV = this.zipName.replace(".zip", "");
        
        let zip = new StreamZip({
            file: zipPath,
            storeEntries: true
        });

        zip.on('ready', () => {
            let dataCSV = zip.entryDataSync(fileCSV);
            zip.close();
            this.startMakingCSVDBs(dataCSV.toString().split("\n"));
        });
    }

    startMakingCSVDBs(csvRows){
        // console.log(csvRows);
        let columnsDB = {
            "SYMBOL": 0,
            "SERIES": 1,
            "OPEN": 2,
            "HIGH": 3,
            "LOW": 4,
            "CLOSE": 5,
            "LAST": 6,
            "PREVCLOSE": 7,
            "TOTTRDQTY": 8,
            "TOTTRDVAL": 9,
            "TIMESTAMP": 10,
            "TOTALTRADES": 11,
            "ISIN": 12
        };
        // console.log(columnsDB);
        let columnsDBKeys = Object.keys(columnsDB);

        let headerRow = csvRows[0].split(",");
        // console.log(headerRow);
    
        let csvFieldObj = {};
        for (let i = 0; i < columnsDBKeys.length; i++){
            let key = columnsDBKeys[i];
            // console.log(key);
            for (let j = 0; j < headerRow.length; j++){
                if (key == headerRow[i]){
                    csvFieldObj[key] = i;
                }
            }
        }
        // console.log(csvFieldObj);

        let newCSVDBCreated = 0;
        for(let i = 1; i < csvRows.length; i++){
            let eachRow = csvRows[i].split(",");
            // console.log(eachRow);
    
            let symbol = eachRow[csvFieldObj['SYMBOL']];
            let series = eachRow[csvFieldObj['SERIES']];
            if(symbol != null && series != null){
                let tableName = "table_" + symbol + "_" + series;
                let tableCSV = tableName.replace(/[|&;$%@"<>()+,]/g, "-") + ".csv";
                let tableCSVPath = this.baseDir + "tData/tCSVDB/" + tableCSV;
                // console.log(tableName, tableCSVPath);

                if (!fs.existsSync(tableCSVPath)) {
                    let firstRowDB = columnsDBKeys.join(",") + '\n';
                    fs.appendFileSync(tableCSVPath, firstRowDB);
                    newCSVDBCreated++;
                }

                let DBRow = [];
                for (let i = 0; i < columnsDBKeys.length; i++){
                    let key = columnsDBKeys[i];
                    var el = eachRow[csvFieldObj[key]];
                    if (el == undefined){
                        DBRow.push("");
                    } else {
                        DBRow.push(el);
                    }            
                }
    
                let rowDB = DBRow.join(",") + '\n';
                fs.appendFileSync(tableCSVPath, rowDB);
            }
        }
        // Top Row for Heading and Last Row is New Empty Line
        console.log("Current Date:", this.currentDate.format("YYYY/MM/DD"), "Total Rows:", csvRows.length - 2, "New CSVs Created:", newCSVDBCreated);

        this.incrementCurrentDate();
        this.programSequence();
    }

    incrementCurrentDate(){
        let nextUpdateDateVar = this.baseDir + "tData/tVariables/NextUpdateDate.var";
        this.currentDate = this.currentDate.add(1, 'day');
        fs.writeFileSync(nextUpdateDateVar, this.currentDate.format("YYYY/MM/DD"));
    }

    programSequence(){
        if (this.checkWhetherToProceed()){
            this.makeDateWiseZipName();
            
            if(this.checkIfZIPExists()){
                // console.log(this.zipName);
                this.getCSVFileFromZIP();
            } else {
                this.incrementCurrentDate();
                this.programSequence();
            }
        }
    }
}

// Inputs ----------------------------------------------------------------------------------
let winDir = "D:/";
let linuxDir = "/home/rukmangadanies/";
let baseDir = (process.platform === "win32") ? winDir : ((process.platform === "linux") ? linuxDir : "");
let startDate = "2001/01/01";
let endDate = "2020/03/31";


// Main Object ----------------------------------------------------------------------------------
let tdb = new dataCSV(baseDir, startDate, endDate);
tdb.programSequence();






