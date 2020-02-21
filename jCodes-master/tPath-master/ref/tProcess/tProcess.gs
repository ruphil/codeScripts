function tProcess() {
  var folderID = '1_b12N0s2WTiY8x-wXXo5qQRTTrGoRJk8';
  var symbolsID = '1kbr8fmodKkFNIum1iDcpM0ClOCAiBm8FC-jbFjnYmf8';
  var templateID = '1ibwGubJmZoRfJR5Q9TjBeDEoVkC910p9jx-Kmfv_DUQ';

  var today = new Date();
  today.setDate(today.getDate() - 1);
  
  var day = new Date(today.getYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  Logger.log(day);
  
  var dayOfMonth = pad(day.getDate(), 2);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var month = monthNames[day.getMonth()];
  var year = day.getYear().toString();
  
  var url = "https://www.nseindia.com/content/historical/EQUITIES/" + year + "/" + month + "/cm" + dayOfMonth + month + year + "bhav.csv.zip";
//  Logger.log(url);
  var zipBlob = UrlFetchApp.fetch(url).getBlob();
  var csvBlob = Utilities.unzip(zipBlob);
  var csvString = csvBlob[0].getDataAsString();
  var lines = csvString.split('\n');
  var colNames = lines[0];
  lines.shift();
  lines.pop();
  var num_lines = lines.length;
  Logger.log(num_lines);
  
  var symSheet = SpreadsheetApp.openById(symbolsID).getSheetByName('syms');
  var lastRow = symSheet.getLastRow();
  var symbolsArry = symSheet.getRange(1, 1, lastRow).getValues();
//  Logger.log(symbolsArry);
  
  var timeStamp = day.toLocaleString('en-US');
  
  var templtSheet = SpreadsheetApp.openById(templateID).getSheetByName('tData');
  var lastRow = templtSheet.getLastRow();
  var datesArry = templtSheet.getRange(1, 1, lastRow).getValues();
  var dateRowPos = chequeDateAvailabilityNPosition(timeStamp, datesArry)[1] + 1;
//  Logger.log(dateRowPos);
  
  if (colNames == "SYMBOL,SERIES,OPEN,HIGH,LOW,CLOSE,LAST,PREVCLOSE,TOTTRDQTY,TOTTRDVAL,TIMESTAMP,TOTALTRADES,ISIN,"){
    for (var i=0; i < num_lines; i++){
      var temp_line = lines[i].split(',');
      var sym = temp_line[0];
      var openToTrades = temp_line.slice(0,12).toString();
      
      var ifSymAvailableNPosition = chequeSymAvailabilityNPosition(sym, symbolsArry);
      var ifSymAvailable = ifSymAvailableNPosition[0];
      var symRowPos = ifSymAvailableNPosition[1] + 1;
      if (!ifSymAvailable){
        var dataStockSheetID = createSSheetIfReqd(folderID, templateID);
        var dataStockSheet = SpreadsheetApp.openById(dataStockSheetID).getSheetByName('tData');
        var lastColumn = dataStockSheet.getLastColumn();
        dataStockSheet.getRange(1, lastColumn + 1).setValue(sym);
        SpreadsheetApp.openById(symbolsID).appendRow([sym, dataStockSheetID]);
        
        var lastColumn = dataStockSheet.getLastColumn();
        var symbolsColArry = dataStockSheet.getRange(1, 1, 1, lastColumn).getValues();
//        Logger.log(symbolsColArry);
        var symColPos = getSymColPosition(sym, symbolsColArry) + 1;
//        Logger.log([dateRowPos, symColPos]);
        SpreadsheetApp.openById(dataStockSheetID).getSheetByName('tData').getRange(dateRowPos, symColPos).setValue(openToTrades);
        
      } else {
        var dataStockSheetID = SpreadsheetApp.openById(symbolsID).getSheetByName('syms').getRange(symRowPos, 2).getValue();
        var dataStockSheet = SpreadsheetApp.openById(dataStockSheetID).getSheetByName('tData');
        var lastColumn = dataStockSheet.getLastColumn();
        var symbolsColArry = dataStockSheet.getRange(1, 1, 1, lastColumn).getValues();
//        Logger.log(symbolsColArry);
        var symColPos = getSymColPosition(sym, symbolsColArry) + 1;
//        Logger.log([dateRowPos, symColPos]);
        SpreadsheetApp.openById(dataStockSheetID).getSheetByName('tData').getRange(dateRowPos, symColPos).setValue(openToTrades);
      }
    }
  } else {
    Logger.log("send Need Attention Mail: columns have collapsed");
  }
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function chequeDateAvailabilityNPosition(date, dateArry){
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].toString() == [obj].toString()) {
            return [true, i];
        }
    }
    return [false, 0];
  }
  var dateAvailNPos = dateArry.contains(date);
  return dateAvailNPos;
}


function chequeSymAvailabilityNPosition(sym, symsArry){
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return [true, i];
        }
    }
    return [false, 0];
  }
  var symAvailNPos = symsArry.contains(sym);
  return symAvailNPos;
}

function getSymColPosition(sym, symbolsColArry){
  Array.prototype.contains = function(obj) {
    var i = this[0].length;
    while (i--) {
        if (this[0][i] == obj) {
            return i;
        }
    }
    return 0;
  }
  var symColPos = symbolsColArry.contains(sym);
  return symColPos;
}

function createSSheetIfReqd(folderID, templateID){
  // Create the first file if folder is empty
  var dataFiles = DriveApp.getFolderById(folderID).getFilesByName('tDataStock');
  if (!dataFiles.hasNext()){
    var folderVar = DriveApp.getFolderById(folderID);
    var dataStockID = DriveApp.getFileById(templateID).makeCopy(folderVar).setName('tDataStock').getId();
    return dataStockID;
  }
  
  // Creating Subsequent Files
  while (dataFiles.hasNext()){
    var dataFileID = dataFiles.next().getId();
    var totalColumns = SpreadsheetApp.openById(dataFileID).getSheetByName('tData').getLastColumn();
    if (totalColumns > 200){
      var folderVar = DriveApp.getFolderById(folderID);
      var dataStockID = DriveApp.getFileById(templateID).makeCopy(folderVar).setName('tDataStock').getId();
      return dataStockID;
    } else return dataFileID;
  }
}
