var fileListSheetID = "1cPclfhFL8kUeXGOzcbmT_LaNOwhTqp_tF_c3EWAPdMA";

function doGet(e) {
  var frontend_page = HtmlService.createTemplateFromFile('frontend_page');
  eval_frontend_page = frontend_page.evaluate();
  eval_frontend_page.setTitle('FileManager');
  return eval_frontend_page.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function check_login(e){
  if (e[0] == 'controller' && e[1] == 'philosopher') {
    var main_console = HtmlService.createTemplateFromFile('main_console');
    eval_main = main_console.evaluate();
    return [eval_main.getContent(), e[0], e[1]];
  }
  var login_console = HtmlService.createTemplateFromFile('login_console');
  eval_login = login_console.evaluate();
  return [eval_login.getContent(), "", ""];
}

function checkFile(fileName){
//  var fileName = "jack";
  
  var sheet = SpreadsheetApp.openById(fileListSheetID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  try {
    var fileNames = sheet.getRange(2, 1, lastRow - 1).getValues();
  } catch (e) {
    return false;
  }
  
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
  }
  
  return fileNames.contains(fileName) ? true: false;
}

function createSheet(fileName){
//  var fileName = "jack.pdf";
  var folderID = "1OM6mHaCD_RXnfaSN_tTgZ9kNQLfbRl6u";
  
  var resource = {
      title: fileName,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{ id: folderID }]
  }
  var fileID = Drive.Files.insert(resource).id;
  var sheet = SpreadsheetApp.openById(fileID).getSheets()[0];
  
  var maxColumns = sheet.getMaxColumns();
  sheet.deleteColumns(2, maxColumns - 1);
  sheet.insertRowsAfter(1000, 4000);
  
  return fileID;
}

function updateSheet(data){
  var fileID = data[0];
  var currentChunkInstance = data[1];
  var currentContentPart = data[2];
  var whetherLastChunk = data[3];
  var totalChunks = data[4];
  
  var spreadSheet = SpreadsheetApp.openById(fileID);
  var sheet = spreadSheet.getSheets()[0];
  var name = spreadSheet.getName();
  
  var spreadSheetAppSucceeded = 0;
  
  try {
    sheet.getRange(currentChunkInstance, 1).setValue(currentContentPart);
    spreadSheetAppSucceeded = 1;
  } catch (e) {}
  
//  if(!spreadSheetAppSucceeded){
//    var range = 'Sheet1!A' + currentChunkInstance + ':A' + currentChunkInstance;
//    // console.log(range);
//    
//    var request = {
//        values: [[currentContentPart]]
//    };
//    
//    Sheets.Spreadsheets.Values.update(request, fileID, range);
//  
//  }
  
  if(whetherLastChunk){
    var now = new Date();
    var sheet = SpreadsheetApp.openById(fileListSheetID).getSheets()[0];
    sheet.appendRow([name, fileID, totalChunks, "completed", now.toLocaleDateString('en-IN'), now.getTime()]);
  }
  
  return "updated";
}

function listFiles(){
    var sheet = SpreadsheetApp.openById(fileListSheetID).getSheets()[0];
    var lastRow = sheet.getLastRow();
    var fileNames = sheet.getRange(2, 1, lastRow - 1).getValues();
    return fileNames;
}

function getTotalChunks(fileName){
  var sheet = SpreadsheetApp.openById(fileListSheetID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  var fileNames = sheet.getRange(2, 1, lastRow - 1).getValues();
  
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return i + 2;
        }
    }
  }
  var index = fileNames.contains(fileName);
  var totalChunks = sheet.getRange(index, 3).getValue();
  var fileID = sheet.getRange(index, 2).getValue();
  return [totalChunks, fileID];
}

function downloadFileChunk(chunkInfo){
  var chunkNo = chunkInfo[0];
  var sheetID = chunkInfo[1];
  
  var sheet = SpreadsheetApp.openById(sheetID).getSheets()[0];
  var chunkData = sheet.getRange(chunkNo, 1).getValue();
  return decodeURIComponent(chunkData);
}

function getChunksInfo(fileName){
  var sheet = SpreadsheetApp.openById(fileListSheetID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  var fileNames = sheet.getRange(2, 1, lastRow - 1).getValues();
  
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return i + 2;
        }
    }
  }
  
  var index = fileNames.contains(fileName);
  var totalChunks = sheet.getRange(index, 3).getValue();
  var fileID = sheet.getRange(index, 2).getValue();
  
  var nonAvailabilityArray = getNonAvailablity(fileID);
  
  return [nonAvailabilityArray, totalChunks, fileID];
}

function getNonAvailablity(fileID){
//  var fileID = "1e3q0OhmgFfG04LTN8tOzfhHlvHCytqFp5oG_EP2VhH8";
  
  var sheet = SpreadsheetApp.openById(fileID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  var dataChunks = sheet.getRange(1, 1, lastRow).getValues();
  
  var nonAvailabilityArray = [];
  for (i = 0; i < dataChunks.length; i++){
    if (dataChunks[i][0] == "") nonAvailabilityArray.push(i+1);
  }
  
//  Logger.log(nonAvailabilityArray);
  return nonAvailabilityArray;  
}


function test(){
  var jack = Array.apply(null, Array(8)).map(Number.call, Number);
  jack.shift();
  Logger.log(jack);
}

