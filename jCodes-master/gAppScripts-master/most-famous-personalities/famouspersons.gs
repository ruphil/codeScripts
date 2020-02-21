function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var sheet = SpreadsheetApp.openById("1mvc4Bzp-L0D3CBM9h4WTYDImKV-OWsOg8K4XSXcCldc").getSheetByName("persons")
  var max_row = sheet.getLastRow()
  Logger.log(max_row)
  
  var row = sheet.getRange(Math.floor(Math.random() * (max_row - 1)) + 2, 2, 1, 3).getValues()
  var name = row[0][0]
  var info_id = row[0][1]
  var photo_id = row[0][2]
  
  var info = DriveApp.getFileById(info_id).getBlob().getDataAsString()
  var photo = DriveApp.getFileById(photo_id).getBlob().getDataAsString()
  
  t.name = name
  t.info = info
  t.photo = photo
  
  eval_t = t.evaluate();
  eval_t.setTitle('Famous Persons');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
