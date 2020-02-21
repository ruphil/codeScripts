function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var sheet = SpreadsheetApp.openById("1UucvgzMrd9R60o443BbEAzv4gwlZJjtN4NM5vT38akk").getSheetByName("words")
  var max_row = sheet.getLastRow()
//  Logger.log(max_row)
  
  var each_row_words = 5
  var rows1 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows2 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows3 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows4 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows5 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows6 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows7 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows8 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows9 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows10 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows11 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  var rows12 = sheet.getRange(Math.floor(Math.random() * (max_row - 1 - each_row_words)) + 2, 2, each_row_words, 2).getValues()
  
  t.each_row_words = each_row_words
  t.rows1 = rows1
  t.rows2 = rows2
  t.rows3 = rows3
  t.rows4 = rows4
  t.rows5 = rows5
  t.rows6 = rows6
  t.rows7 = rows7
  t.rows8 = rows8
  t.rows9 = rows9
  t.rows10 = rows10
  t.rows11 = rows11
  t.rows12 = rows12
  
  eval_t = t.evaluate();
  eval_t.setTitle('More Hindi Words');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
