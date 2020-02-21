function test(){
  var obj = {"Sep": 8}
  Logger.log(obj['Sep']);
}

function tDailyCron(){
  var folder_ID = '18dcpzxu5V1Hg6I9ZVPoFPQ39ydIf_m8L';

  var today = new Date();
  var month_val = today.getMonth();
  var year_half = Math.floor(month_val / 6) + 1;
  var year = today.getYear();

  var filename_halfyear = "tDailyCron-" + year_half.toString() + "of2-" + year.toString();
  var fileAvailable = DriveApp.getFolderById("18dcpzxu5V1Hg6I9ZVPoFPQ39ydIf_m8L").getFilesByName(filename_halfyear).hasNext();
  
  if (!fileAvailable){
    var resource = {
      title: filename_halfyear,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{ id: folder_ID }]
    }
    var currentHalfYearFileID = Drive.Files.insert(resource).id;
    
    SpreadsheetApp.openById(currentHalfYearFileID).getSheets()[0].setName("dailyCron");
  }
  
  var currentHalfYearFileID = DriveApp.getFolderById(folder_ID).getFilesByName(filename_halfyear).next().getId();
  var sheet = SpreadsheetApp.openById(currentHalfYearFileID).getSheetByName("dailyCron");
  
  var getDay = today.getDay() % 6;
  var weekend_bool = (getDay != 0);
  
  if (weekend_bool) {
    var url = "https://www.nseindia.com/products/content/sec_bhavdata_full.csv";
    var response = UrlFetchApp.fetch(url).getContentText();
    var lines = response.split('\n');
    var num_lines = lines.length;
    
    var lines_array = [];
    for (var i = 0; i < num_lines; i++ ){
      lines_array.push([lines[i]]);
    }
    
    var data_date = lines_array[1].toString().split(',')[2];
    var last_column = sheet.getLastColumn();
    
    Logger.log([data_date, today]);
    
    var monthObj = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11};
    var data_dateComps = data_date.split('-');
    Logger.log(data_dateComps);
    
    var dataDateJS = new Date(data_dateComps[2], monthObj[data_dateComps[1]], data_dateComps[0]);
    Logger.log(dataDateJS);
    
    var same_date = 0;
    if (today.getYear() == dataDateJS.getYear() && today.getMonth() == dataDateJS.getMonth() && today.getDay() == dataDateJS.getDay()) same_date = 1;
    Logger.log(same_date);
    
    if (!same_date) {
      sheet.getRange(1, last_column + 1).setValue(today);
      sheet.getRange(3, last_column + 1).setValue('holiday');
    } else {
    sheet.getRange(1, last_column + 1).setValue(today);
    sheet.getRange(2, last_column + 1).setValue(num_lines);
    sheet.getRange(3, last_column + 1).setValue(data_date);
    sheet.getRange(4, last_column + 1, num_lines).setValues(lines_array);
    }
  }
}
