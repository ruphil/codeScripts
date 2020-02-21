function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('tViewer');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSymbols(){
  const folderID = '1VYs8mbyrj50t9RS6a9-gHkiDn042qC-I';
  var files = DriveApp.getFolderById(folderID).getFiles();
  
  var symbolsDataArry = [];
  while (files.hasNext()){
    var fileID = files.next().getId();
    var sheet = SpreadsheetApp.openById(fileID).getSheetByName('tData');
    var lastRow = sheet.getLastRow();
    var symbolsData = sheet.getRange(5, 1, lastRow - 4).getValues();
    symbolsDataArry.push(symbolsData);
//    break;
  }
  
  return symbolsDataArry;
}

function loadData(symbol){
  var symbol = 'ADLABS,EQ';
  const folderID = '1VYs8mbyrj50t9RS6a9-gHkiDn042qC-I';
  var files = DriveApp.getFolderById(folderID).getFiles();
  
  // Sorting files
  var orderNFiles = [];
  while (files.hasNext()){
    var file = files.next();
    var fileName = file.getName();
    var fileNameParts = fileName.split('-');
    var orderIdentifier = fileNameParts[2].concat(fileNameParts[1].split('of')[0]);
    orderNFiles.push([file, orderIdentifier]);
  }
  
  orderNFiles.sort(function(a, b) {
    return a[1] - b[1];
  });
  
  var totalFiles = orderNFiles.length;
  var totalData = [];
  for (var i=0; i < totalFiles; i++){
    var currentHalfYearFileID = orderNFiles[i][0].getId();
    var dataStockSheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName('tData');
    var lastColumn = dataStockSheet.getLastColumn();
    var lastRow = dataStockSheet.getLastRow();
    var symbolsArry = dataStockSheet.getRange(5, 1, lastRow - 4).getValues();
    
    var ifSymAvailableNPosition = chequeSymAvailabilityNPosition(symbol, symbolsArry);
    Logger.log(ifSymAvailableNPosition);
    var ifSymAvailable = ifSymAvailableNPosition[0];
    var symRowPos = ifSymAvailableNPosition[1] + 5;
    if(ifSymAvailable){
      var symbolsArry = dataStockSheet.getRange(symRowPos, 2, 1, lastColumn - 1).getValues();
      Logger.log(symbolsArry[0]);
      totalData = totalData.concat(symbolsArry[0]);
//      break;
    } else continue;
  }
  
  return totalData;
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
