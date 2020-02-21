function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var todayDate = new Date().toISOString().slice(5,10).split("-").reverse().join("+");
  
  var sheet = SpreadsheetApp.openById("19dLCMJqH05yGhTY3I22bRX0hjexPQDpf61S-qkyQLsY").getSheetByName("birthdays")
  var max_row = sheet.getLastRow()
  
  t.name_birthday = "No Loved Ones"
  t.date_birthday = "Birthday Today"
  
  var data = sheet.getRange(2, 2, max_row - 1, 3).getValues();
  Logger.log(data);
  for (var i = 0; i < data.length; i++){
    if(data[i][0] == todayDate){
      t.name_birthday = data[i][2];
      t.date_birthday = todayDate.split("+").join("-") + "-" + data[i][1];
      break;
    }
  }
  
  eval_t = t.evaluate();
  eval_t.setTitle('Remainder Daily');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
