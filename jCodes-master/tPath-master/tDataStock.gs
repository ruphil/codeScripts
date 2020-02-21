function tDataStock(dayInstance) {
  const folder_ID = '1VYs8mbyrj50t9RS6a9-gHkiDn042qC-I';
  var currentHalfYearFileID = createRGetFileName(folder_ID, dayInstance);
  
  if (checkIfWeekend(dayInstance)){
    var dataString = "weekend";
    markWeekendRHoliday(dayInstance, currentHalfYearFileID, dataString);
    return;
  }
  
  var dataString = getCurrentData(dayInstance);
  if (dataString == "holiday"){
    markWeekendRHoliday(dayInstance, currentHalfYearFileID, dataString);
    return;
  }
  
  tProcessNPush(dayInstance, currentHalfYearFileID, dataString);
  tSortSheet(currentHalfYearFileID);
  
}

function createRGetFileName(folder_ID, dayInstance){
  var month_val = dayInstance.getMonth();
  var year_half = Math.floor(month_val / 6) + 1;
  var year = dayInstance.getYear();

  var filename_halfyear = "tData-" + year_half.toString() + "of2-" + year.toString();
  var files = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear);
  var fileAvailable = files.hasNext();
  
  if (!fileAvailable){
    var resource = {
      title: filename_halfyear,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{ id: folder_ID }]
    }
    var currentHalfYearFileID = Drive.Files.insert(resource).id;
    
    var sheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheets()[0];
    sheet.setName("tData");
    
    var startDate = new Date(year, ((year_half - 1) * 6), 01, 12, 0, 0);
    var endDate = new Date(year, (5 + (year_half - 1) * 6), 30 + (year_half - 1), 12, 0, 0);
    
    var datesString = [];
    var currentDate = startDate;
    while (currentDate.getTime() <= endDate.getTime()){
      var dtStr = currentDate.getYear() + '$' + (currentDate.getMonth() + 1).toString() + '$' + currentDate.getDate();
      datesString.push([dtStr]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    var length = datesString.length;
    sheet.getRange(1, 1).setValue('datesString');
    sheet.getRange(2, 1).setValue('remarks');
    sheet.getRange(3, 1).setValue('status');
    sheet.getRange(4, 1).setValue('numLines');
    sheet.getRange(1, 2, 1, length).setValues([datesString]);
    return currentHalfYearFileID;
  }
  var currentHalfYearFileID = files.next().getId();
  return currentHalfYearFileID;
}

function checkIfWeekend(day){
  var getDay = day.getDay() % 6;
  return getDay == 0;
}

function getCurrentData(day){
  var dayOfMonth = pad(day.getDate(), 2);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var month = monthNames[day.getMonth()];
  var year = day.getYear().toString();
  
  var url = "https://www.nseindia.com/content/historical/EQUITIES/" + year + "/" + month + "/cm" + dayOfMonth + month + year + "bhav.csv.zip";
  
  try {
    var zipBlob = UrlFetchApp.fetch(url).getBlob();
  }
  catch (err) {
    return "holiday";
  }
  var csvBlob = Utilities.unzip(zipBlob);
  return csvBlob[0].getDataAsString();
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function markWeekendRHoliday(dayInstance, currentHalfYearFileID, dataString){
  var dataStockSheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName('tData');
  var lastColumn = dataStockSheet.getLastColumn();
  var datesArry = dataStockSheet.getRange(1, 1, 1, lastColumn).getValues();
  var dateColPos = getDatePosition(dayInstance, datesArry) + 1;
//  Logger.log(dateColPos);

  if (dataString == "weekend") {
    dataStockSheet.getRange(2, dateColPos).setValue("weekend");
    dataStockSheet.getRange(3, dateColPos).setValue("completed");
    dataStockSheet.getRange(4, dateColPos).setValue(0);
    return;
  } else if (dataString == "holiday") {
    dataStockSheet.getRange(2, dateColPos).setValue("holiday");
    dataStockSheet.getRange(3, dateColPos).setValue("completed");
    dataStockSheet.getRange(4, dateColPos).setValue(0);
    return;
  }
}

function getDatePosition(date, datesArry){
  Array.prototype.contains = function(obj) {
    var i = this[0].length;
    while (i--) {
        if (this[0][i] == [obj]) {
            return i;
        }
    }
    return 0;
  }
  
  var dtStr = date.getYear() + '$' + (date.getMonth() + 1).toString() + '$' + date.getDate();
  return datesArry.contains(dtStr);
}

function tProcessNPush(dayInstance, currentHalfYearFileID, dataString){
  var dataStockSheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName('tData');
  var lastColumn = dataStockSheet.getLastColumn();
  var datesArry = dataStockSheet.getRange(1, 1, 1, lastColumn).getValues();
  var dateColPos = getDatePosition(dayInstance, datesArry) + 1;
  
  var lines = dataString.split('\n');
  var colNames = lines[0];
  lines.shift();
  lines.pop();
  var num_lines = lines.length;
//  Logger.log(num_lines);
  dataStockSheet.getRange(2, dateColPos).setValue("workingDay");
  dataStockSheet.getRange(4, dateColPos).setValue(num_lines);
  
  var lastRow = dataStockSheet.getLastRow();
  var symbolsArry = dataStockSheet.getRange(5, 1, lastRow - 3).getValues();
//  Logger.log(symbolsArry);
  
  if (colNames == "SYMBOL,SERIES,OPEN,HIGH,LOW,CLOSE,LAST,PREVCLOSE,TOTTRDQTY,TOTTRDVAL,TIMESTAMP,TOTALTRADES,ISIN,"){
//    num_lines = 5;
    for (var i=0; i < num_lines; i++){
      var temp_line = lines[i].split(',');
      var sym = temp_line.slice(0,2).toString();
//      Logger.log(sym);
      var openToTrades = temp_line.slice(0,12).toString();
      
      var ifSymAvailableNPosition = chequeSymAvailabilityNPosition(sym, symbolsArry);
      var ifSymAvailable = ifSymAvailableNPosition[0];
      var symRowPos = ifSymAvailableNPosition[1] + 5;
//      var ifSymAvailable = 0;
//      Logger.log([sym, symRowPos]);
      if (ifSymAvailable){
        dataStockSheet.getRange(symRowPos, dateColPos).setValue(openToTrades);
      } else {
        var lastRow = dataStockSheet.getLastRow();
        dataStockSheet.getRange(lastRow + 1, 1).setValue(sym);
        dataStockSheet.getRange(lastRow + 1, dateColPos).setValue(openToTrades);
      }
    }
  }
  dataStockSheet.getRange(3, dateColPos).setValue("completed");
}

function chequeSymAvailabilityNPosition(sym, symsArry){
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return [true, i];
        }
    }
    return [false, -5];
  }
  var symAvailNPos = symsArry.contains(sym);
  return symAvailNPos;
}

function tSortSheet(currentHalfYearFileID){
  var dataStockSheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName('tData');
  var lastRow = dataStockSheet.getLastRow();
  var lastCol = dataStockSheet.getLastColumn();
  dataStockSheet.getRange(5, 1, lastRow - 4, lastCol).sort(1);
}

function testScript(){

  
}
