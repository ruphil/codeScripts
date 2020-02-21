function tDailyCron() {
  const folder_ID = '18dcpzxu5V1Hg6I9ZVPoFPQ39ydIf_m8L';
  
  var today = new Date();
  Logger.log(today);
//  today.setDate(today.getDate() - 3);
  Logger.log(today);
  
  var filename_halfyear = createIfFileNotThere(folder_ID, today);
  
  if (checkIfWeekend(today)){
    var csvString = "weekend";
    pushResponse(folder_ID, today, filename_halfyear, csvString);
    return 0;
  }
  
  var csvString = getCurrentData(today);
  pushResponse(folder_ID, today, filename_halfyear, csvString)
}

function checkIfWeekend(day){
  var getDay = day.getDay() % 6;
  return getDay == 0;
}

function createIfFileNotThere(folder_ID, interDate){
  var month_val = interDate.getMonth();
  var year_half = Math.floor(month_val / 6) + 1;
  var year = interDate.getYear();

  var filename_halfyear = "tDailyCron-" + year_half.toString() + "of2-" + year.toString();
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

function pushResponse(folder_ID, day, filename_halfyear, csvString){
  var currentHalfYearFileID = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear).next().getId();
  var sheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName("dailyCron");
  var last_column = sheet.getLastColumn();
  
  if (csvString == "holiday"){
    sheet.getRange(1, last_column + 1).setValue(day.toLocaleDateString("en-US"));
    sheet.getRange(2, last_column + 1).setValue('holiday');
    return 0;
  } else if (csvString == "weekend"){
    sheet.getRange(1, last_column + 1).setValue(day.toLocaleDateString("en-US"));
    sheet.getRange(2, last_column + 1).setValue('weekend');
    return 0;
  }
  
  var lines = csvString.split('\n');
  var num_rows = lines.length;
  var num_lines = lines.length - 2;
  
  var lines_array = [];
  for (var i = 0; i < num_rows; i++ ){
    lines_array.push([lines[i]]);
  }
  
//  Logger.log(lines_array[num_rows-2]);
  
  sheet.getRange(1, last_column + 1).setValue(day.toLocaleDateString("en-US"));
  sheet.getRange(2, last_column + 1).setValue(num_lines);
  sheet.getRange(4, last_column + 1, num_rows).setValues(lines_array);
}
