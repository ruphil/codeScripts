function jack() {
  var url = "https://www.nseindia.com/products/content/sec_bhavdata_full.csv";
  var response = UrlFetchApp.fetch(url).getContentText();
  var lines = response.split('\n');
  var num_lines = lines.length;
  
  var lines_array = [];
  for (var i = 0; i < num_lines; i++ ){
    lines_array.push([lines[i]]);
  }
  
//  Logger.log(lines_array);
  
  var sheet = SpreadsheetApp.openById("1aRJWXKuCBQJVpYQdGPlKMJNXFcgyc5x-X0-MPP3WQDw").getSheetByName("data");
  var last_column = sheet.getMaxColumns();
  var date = new Date();
//  Logger.log(date);
  sheet.getRange(1, last_column + 1).setValue(date);
  sheet.getRange(2, last_column + 1, num_lines).setValues(lines_array);
}
