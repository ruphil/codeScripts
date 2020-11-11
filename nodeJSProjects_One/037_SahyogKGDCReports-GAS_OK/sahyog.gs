var sheetID = "1QutCMWQF_Xqwtk_X5iF0qucvce-AsJqPUv7sbGFt5fo";
var sheet = SpreadsheetApp.openById(sheetID).getSheetByName("sahyog");

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Sahyog-KGDC');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function registerUser(data){
  var mobile = data[0];
  var name = data[1];
  var designation = data[2];
  var password = data[3];
  var totalFeatures = data[4];

  var lastColumn = sheet.getLastColumn();
  sheet.getRange(1, lastColumn + 1, 4, 1).setValues([[mobile], [password], [name], [designation]]);
  
  var columnLetter = columnToLetter(lastColumn + 1);
  var formula = '=index(' + columnLetter + ':' + columnLetter + ',max(row(' + columnLetter + ':' + columnLetter + ')*(' + columnLetter + ':' + columnLetter + '<>"")))';
  sheet.getRange(6, lastColumn).setFormula(formula);
  
  var rowIndex = getTodaysRowIndex();
  sheet.getRange(rowIndex - 1, lastColumn + 1, 1, 1).setValue(totalFeatures);
}

function columnToLetter(column){
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  console.log(letter);
  return letter;
}

function getMobileNumbers(){
  var lastColumn = sheet.getLastColumn();
  
  var data = "";
  try {
    var data = sheet.getRange(1, 2, 1, lastColumn - 1).getValues();
  } catch (e) {}
  
  return data;
}

function checkPassword(data){
  var columnIndex = data[0];
  var password = data[1];
  
  var actualPassword = sheet.getRange(2, columnIndex).getValue();
  if (password == actualPassword){
    return true;
  }
  else {
    return false;
  }
}

function getUserDetails(data){
  var columnIndex = data[0];
  if(checkPassword(data)){
    var rowIndex = getTodaysRowIndex();
    
    var userDetails = sheet.getRange(1, columnIndex, rowIndex, 1).getValues();
    return userDetails;
  }
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function submitData(data){
  var columnIndex = data[0];
  var totalData = data[2];
  if(checkPassword(data)){
    var rowIndex = getTodaysRowIndex();
    sheet.getRange(rowIndex, columnIndex).setValue(totalData);
  }
}

function getTodaysRowIndex(){
  var d = new Date();
  var todayStr = d.getDate() + "-" + pad((d.getMonth() + 1), 2) + "-" + d.getFullYear();
  
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(7, 1, lastRow - 1, 1).getValues();
  
  var lastIndex = 0;
  for (var i = 0; i < data.length; i++){
    var dd = new Date(data[i]);
    var dayStr = dd.getDate() + "-" + pad((dd.getMonth() + 1), 2) + "-" + dd.getFullYear();
    if(todayStr == dayStr){
      lastIndex = i;
    }
  }
  
  lastIndex = lastIndex + 7;
  return lastIndex;
}

function downloadReport(){
  var senioritySheet = SpreadsheetApp.openById(sheetID).getSheetByName("seniority");
  var seniorityData = senioritySheet.getRange(1, 1, senioritySheet.getLastRow(), senioritySheet.getLastColumn()).getValues();
  
  var colIndex = sheet.getLastColumn();
  var namesReport = sheet.getRange(3, 2, 1, colIndex - 1).getValues();
  var lastrowRow = sheet.getRange(6, 1, 1, sheet.getLastColumn()).getValues();
  
  var rowIndex = getTodaysRowIndex();
  var startRow = rowIndex - 4;
  
  var reportsXL = sheet.getRange(startRow, 2, 5, colIndex - 1).getValues();
  return [seniorityData, namesReport, lastrowRow, reportsXL];
}
