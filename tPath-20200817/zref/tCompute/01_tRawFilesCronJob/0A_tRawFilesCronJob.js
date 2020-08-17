// Requires -----------------------------------------------------------------------------
const StreamZip = require('node-stream-zip');
const https = require('https');
const fs = require('fs');
const { spawnSync} = require('child_process');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

let token = fs.readFileSync('../tokengit.txt', "utf-8").replace(/(\r\n|\n|\r)/gm, "");

// Main Class   ------------------------------------------------------------------------
class tCron{
    constructor(baseDir){
        this.welcomeMsg = "## Starting To Run Cron Job Forever... \n";
        this.baseDir = baseDir;

        this.overwriteReport(this.welcomeMsg);
    }

    overwriteReport(content){
        let dcronReport = this.baseDir + "tData/tReports/dcron.md";
        let lastUpdateVar = this.baseDir + "tData/tVariables/lastUpdate.var";
        if(!fs.existsSync(lastUpdateVar)){
            fs.writeFileSync(dcronReport, content);
        }
    }

    getLastUpdate(){
        let lastUpdateVar = this.baseDir + "tData/tVariables/lastUpdate.var";
        if(fs.existsSync(lastUpdateVar)){
            this.lastUpdate = dayjs(fs.readFileSync(lastUpdateVar, "utf-8"), "YYYY/MM/DD");
        }
    }

    constructTodaysParameters(){
        let dayjsInst = dayjs().utc().add(5.5, 'hour');
        this.url = dayjsInst.format('[https://www1.nseindia.com/content/historical/EQUITIES]/YYYY/') + dayjsInst.format('MMM').toUpperCase() + dayjsInst.format('/[cm]DD') + dayjsInst.format('MMM').toUpperCase() + dayjsInst.format('YYYY[bhav.csv.zip]');
        this.todaysDate = dayjs(dayjsInst.format("YYYY/MM/DD"), "YYYY/MM/DD");
    }

    constructTMinusParameters(d){
        let dayjsInst = dayjs().utc().add(5.5, 'hour').subtract(d, 'day');
        this.url = dayjsInst.format('[https://www1.nseindia.com/content/historical/EQUITIES]/YYYY/') + dayjsInst.format('MMM').toUpperCase() + dayjsInst.format('/[cm]DD') + dayjsInst.format('MMM').toUpperCase() + dayjsInst.format('YYYY[bhav.csv.zip]');
        this.todaysDate = dayjs(dayjsInst.format("YYYY/MM/DD"), "YYYY/MM/DD");
    }

    whetherToSkip(){
        if (this.todaysDate.day() == 0 || this.todaysDate.day() == 6) {
            // console.log("Today Is A Weekend");
            return true;
        } else if (this.lastUpdate == undefined){
            // console.log("Variable is NULL");
            return false;
        } else if (this.lastUpdate < this.todaysDate) {
            // console.log("Date Not Available");
            return false;
        } else {
            // console.log("Date Already Available");
            return true;
        }
    }

    downloadFileNAddToReportNMakeCSVDB(){
        let url = this.url;
        let zipName = url.replace(/^.*[\\\/]/, '');
        let zipPath = this.baseDir + 'tData/tRawFiles/' + zipName;
        this.zipName = zipName;
        
        const file = fs.createWriteStream(zipPath);
        let that = this;
        https.get(url, function(response) {
            let statusCode = response.statusCode;
            if (statusCode == 200){
                // console.log("Now Downloading");
                // console.log(url, zipPath);
                response.pipe(file);
                file.on('finish', function() {
                    file.close();
                    that.addToReport("Status Code: " + statusCode + " ~ " + zipName + " Downloaded Successfully \n ------");
                    that.updateLastVariable(that.todaysDate.format("YYYY/MM/DD"));
                    that.makeCSVDB();
                });
            }
        });
    }

    addToReport(content){
        let dcronReport = this.baseDir + "tData/tReports/dcron.md"
        let dayjsInst = dayjs().utc().add(5.5, 'hour');
        let consoleTimeStr = dayjsInst.format("* YYYY/MM/DD {HH:mm:ss} > ");

        let fileContent = "";
        if(fs.existsSync(dcronReport)){
            fileContent = fs.readFileSync(dcronReport, "utf-8");
        }
        
        let insertContent = consoleTimeStr + content + '\n\n' + fileContent;
        fs.writeFileSync(dcronReport, insertContent);
    }

    updateLastVariable(lastDownloadDate){
        let lastUpdateVar = this.baseDir + "tData/tVariables/lastUpdate.var";
        fs.writeFileSync(lastUpdateVar, lastDownloadDate);
    }

    makeCSVDB(){
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
        this.addToReport("Total Rows: " + (csvRows.length - 2).toString() + " ~ New CSVs Created: " + newCSVDBCreated.toString());
        this.updateGIT();
    }

    updateGIT(){
        let tPaths = {
            tVariables: {
                folder: this.baseDir + 'tData/tVariables',
                gitURL: `https://ruphil:${token}@github.com/ruphil/tVariables.git`
            },
            tRawFiles: {
                folder: this.baseDir + 'tData/tRawFiles',
                gitURL: `https://ruphil:${token}@github.com/ruphil/tRawFiles.git`
            },
            tCSVDB: {
                folder: this.baseDir + 'tData/tCSVDB',
                gitURL: `https://ruphil:${token}@github.com/ruphil/tCSVDB.git`
            },
            tReports: {
                folder: this.baseDir + 'tData/tReports',
                gitURL: `https://ruphil:${token}@github.com/ruphil/tReports.git`
            }
        };

        let tPathKeys = Object.keys(tPaths);
        for (let i = 0; i < tPathKeys.length; i++){
            let folderPath = tPaths[tPathKeys[i]].folder;
            let url = tPaths[tPathKeys[i]].gitURL;
            
            // console.log(tPathKeys[i].toString());
            this.addToReport("Pushing Git '" + tPathKeys[i].toString() + "' Started");
            spawnSync('git', ['-C', folderPath, 'add', './*']);
            spawnSync('git', ['-C', folderPath, 'commit', '-a', '-m', 'auto']);
            spawnSync('git', ['-C', folderPath, 'remote', 'set-url', 'origin', url]);
            spawnSync('git', ['-C', folderPath, 'push']);
            // this.getOut(spawnSync('git', ['-C', folderPath, 'add', './*']));
            // this.getOut(spawnSync('git', ['-C', folderPath, 'commit', '-a', '-m', 'auto']));
            // this.getOut(spawnSync('git', ['-C', folderPath, 'remote', 'set-url', 'origin', url]));
            // this.getOut(spawnSync('git', ['-C', folderPath, 'push']));
        }
    }

    getOut(child){
        if (!(child.error == undefined)){
            console.log('error', child.error.toString());
        }
        if (!(child.stdout == "")){
            console.log('stdout ', child.stdout.toString());
        }
        if (!(child.stderr == "")){
            console.log('stderr ', child.stderr.toString());
        }
    }

    whetherItsTime(){
        let dayjsInst = dayjs().utc().add(5.5, 'hour');
        return ((17 < dayjsInst.hour()) && (dayjsInst.hour() < 23)) ? true: false;
    }

    startProgramSequence(){
        if(c.whetherItsTime()){
            c.getLastUpdate();
            c.constructTodaysParameters();
            // c.constructTMinusParameters(2);
            if(!c.whetherToSkip()) {
                c.downloadFileNAddToReportNMakeCSVDB();
            }
        }
    }

    test(){

    }
}

// Inputs   ---------------------------------------------------------------------------------
let winDir = "D:/";
let linuxDir = "/home/rukmangadanies/";
let baseDir = (process.platform === "win32") ? winDir : ((process.platform === "linux") ? linuxDir : "");
let interval = 30 * 60 * 1000; // Half An Hour

// Program Sequence -------------------------------------------------------------------------
let c = new tCron(baseDir);
// c.startProgramSequence();
// c.test();
// c.updateGIT();

setInterval(() => {
    c.startProgramSequence();
}, interval);

