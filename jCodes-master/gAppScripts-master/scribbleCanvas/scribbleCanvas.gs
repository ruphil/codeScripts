function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Scribble Canvas');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function load_snapshot(){
  var sheet = SpreadsheetApp.openById("17bB9lbMa-92pVbSuicnpVt5cAUrzRjAMN7vphwptddM").getSheetByName("scribbleCanvasSnapshot");
  var max_row = sheet.getLastRow();
  var data = sheet.getRange(1, 1, max_row).getValues();
  var data_str = "";
  for (var i = 0; i < data.length; i++){
    data_str += data[i];
  }
  return data_str;
}

function update_snapData(data){
  var chunks = [];
  var chunk_length = 50000;
  for (var i = 0, charsLength = data.length; i < charsLength; i += chunk_length) {
    chunks.push([data.substring(i, i + chunk_length)]);
  }
  var num_of_rows_reqd = chunks.length;
  var sheet = SpreadsheetApp.openById("17bB9lbMa-92pVbSuicnpVt5cAUrzRjAMN7vphwptddM").getSheetByName("scribbleCanvasSnapshot");
  sheet.clear();
  sheet.getRange(1, 1, num_of_rows_reqd).setValues(chunks);
}

function setTabId(data){
  SpreadsheetApp.openById("1zEPYBGxRtkSSSfjU88Ve9ovxrkbYLc7mMQFStbsCNt0").getSheetByName("tabId").getRange(1, 1).setValue(data);
}

function getTabId(){
  return SpreadsheetApp.openById("1zEPYBGxRtkSSSfjU88Ve9ovxrkbYLc7mMQFStbsCNt0").getSheetByName("tabId").getRange(1, 1).getValue();
}

// DriveApp Utilization Script

//function load_snapshot(){
//  return DriveApp.getFileById("1fSe3fDpAJhHy6dK3ZcBvRAKBWGKqUGSE").getBlob().getDataAsString();
//}
//
//function update_snapData(data){
//  DriveApp.getFileById("1fSe3fDpAJhHy6dK3ZcBvRAKBWGKqUGSE").setContent(data);
//}
//
//function setTabId(data){
//  DriveApp.getFileById("1Q4cxydcs55rkZP4dE0Act8NqK6ZEeXXO").setContent(data);
//}
//
//function getTabId(){
//  return DriveApp.getFileById("1Q4cxydcs55rkZP4dE0Act8NqK6ZEeXXO").getBlob().getDataAsString();
//}
