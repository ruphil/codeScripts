function tPullCron() {
  const folder_ID = '1w6fLbJ48REwsqW5UFR9OwAL7axuKpEoK';
  const tPullStore_ID = '1Z7PZgoR8mSyypa578EL_CnuFdy83on7RS_IDHKROzJI';
  
  var dates = getDates(tPullStore_ID);
  aquireData(folder_ID, tPullStore_ID, dates[0], dates[1]);
}

function getDates(tPullStore_ID){
  var storeValues = SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(1, 2, 3).getValues();
  var endDate = storeValues[1][0];
  if (storeValues[2][0] == 0) {
    var interDate = storeValues[0][0]; // getting startDate
    return ([interDate, endDate]);
  } else {
    var interDate = storeValues[2][0]; // getting interDate
    return ([new Date(interDate), new Date(endDate)]);
  }
}

function aquireData(folder_ID, tPullStore_ID, interDate, endDate){
  if (interDate.getTime() > endDate.getTime()){
    if(ScriptApp.getProjectTriggers().length != 0){
      ScriptApp.deleteTrigger(ScriptApp.getProjectTriggers()[0]);
    }
    SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(3, 2).setValue(0).setNumberFormat("0");
    return;
  }

  if (checkIfWeekend(interDate)){
    interDate.setDate(interDate.getDate() + 1);
    SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(3, 2).setValue(interDate.toLocaleDateString("en-US"));
    return;
  }

  var filename_halfyear = createIfFileNotThere(folder_ID, interDate);

  var dataExistsPlusPosition = checkIfDataPresentAndFindPosition(folder_ID, interDate, filename_halfyear);
  var dataExists = dataExistsPlusPosition[0];
  if (dataExists){
    interDate.setDate(interDate.getDate() + 1);
    SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(3, 2).setValue(interDate.toLocaleDateString("en-US"));
    return;
  }

  var csvString = getCurrentData(interDate);
  var dataPosition = dataExistsPlusPosition[1];
  pushResponse(folder_ID, interDate, filename_halfyear, csvString, dataPosition);

  interDate.setDate(interDate.getDate() + 1);
  SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(3, 2).setValue(interDate.toLocaleDateString("en-US"));
}

function checkIfWeekend(interDate){
  var getDay = interDate.getDay() % 6;
  return getDay == 0;
}

function createIfFileNotThere(folder_ID, interDate){
  var month_val = interDate.getMonth();
  var year_half = Math.floor(month_val / 6) + 1;
  var year = interDate.getYear();

  var filename_halfyear = "tPullCron-" + year_half.toString() + "of2-" + year.toString();
  var fileAvailable = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear).hasNext();
  
  if (!fileAvailable){
    var resource = {
      title: filename_halfyear,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{ id: folder_ID }]
    }
    var currentHalfYearFileID = Drive.Files.insert(resource).id;
    
    SpreadsheetApp.openById(currentHalfYearFileID).getSheets()[0].setName("pullCron");
  }
  return filename_halfyear;
}

function checkIfDataPresentAndFindPosition(folder_ID, interDate, filename_halfyear){
  var currentHalfYearFileID = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear).next().getId();
  var sheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName("pullCron");
  
  var lastColumn = sheet.getLastColumn();
  
  try {
    var dateData = sheet.getRange(1, 1, 1, lastColumn).getValues();
  }
  catch(err) {
    return [false, 1];
  }
  
  var timeData = [];
  var dataExists = false;
  for (var i = 0; i < dateData[0].length; i++){
    timeData.push(dateData[0][i].getTime());
    if (interDate.getYear() == dateData[0][i].getYear() && interDate.getMonth() == dateData[0][i].getMonth() && interDate.getDate() == dateData[0][i].getDate()){
      dataExists = true;
    }
  }
  
  if (dataExists) return [dataExists, 0];
  
  var interTime = interDate.getTime();
  timeData.push(interTime);
  timeData.sort();
  
  var index = timeData.indexOf(interTime) + 1;
  Logger.log(index);
  
  return [dataExists, index];
}

function getCurrentData(interDate){
  var day = pad(interDate.getDate(), 2);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var month = monthNames[interDate.getMonth()];
  var year = interDate.getYear().toString();
  
  var url = "https://www.nseindia.com/content/historical/EQUITIES/" + year + "/" + month + "/cm" + day + month + year + "bhav.csv.zip";
  Logger.log(url);
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

function pushResponse(folder_ID, interDate, filename_halfyear, csvString, dataPosition){
  var currentHalfYearFileID = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear).next().getId();
  var sheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName("pullCron");
  var last_column = sheet.getLastColumn();
  
  if (csvString == "holiday"){
    var insrtd_sheet = sheet.insertColumnBefore(dataPosition);
    insrtd_sheet.getRange(1, dataPosition).setValue(interDate.toLocaleDateString("en-US"));
    insrtd_sheet.getRange(2, dataPosition).setValue("holiday");
    return 0;
  }
  
  var lines = csvString.split('\n');
  var num_lines = lines.length;
  
  var lines_array = [];
  for (var i = 0; i < num_lines; i++ ){
    lines_array.push([lines[i]]);
  }
  
  Logger.log(dataPosition);
  var insrtd_sheet = sheet.insertColumnBefore(dataPosition);
  insrtd_sheet.getRange(1, dataPosition).setValue(interDate.toLocaleDateString("en-US"));
  insrtd_sheet.getRange(2, dataPosition).setValue(num_lines);
  insrtd_sheet.getRange(4, dataPosition, num_lines).setValues(lines_array);
}

function testScript(){
  Logger.log(2);
}
