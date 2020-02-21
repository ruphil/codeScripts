function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  // Thirukural Section
  sheet1 = SpreadsheetApp.openById("1DKYqN2LUXbdarCf9892UdNZZ72wiZRUs1mMsGwge_mU").getSheetByName("thirukkural")
  kural1 = sheet1.getRange(Math.floor(Math.random() * 1331) + 2, 2, 1, 5).getValues()
  kural2 = sheet1.getRange(Math.floor(Math.random() * 1331) + 2, 2, 1, 5).getValues()
  t.kural1 = kural1
  t.kural2 = kural2
  
  // Hindi words Section
  sheet3 = SpreadsheetApp.openById("1JZ-JVkO1SWjZ250p0XrKgqdiU1So-8iOhsANJHTdEW0").getSheetByName("phrases")
  word1 = sheet3.getRange(Math.floor(Math.random() * 5748) + 2, 2, 1, 2).getValues()
  word2 = sheet3.getRange(Math.floor(Math.random() * 5748) + 2, 2, 1, 2).getValues()
  word3 = sheet3.getRange(Math.floor(Math.random() * 5748) + 2, 2, 1, 2).getValues()
  word4 = sheet3.getRange(Math.floor(Math.random() * 5748) + 2, 2, 1, 2).getValues()
  t.word1 = word1
  t.word2 = word2
  t.word3 = word3
  t.word4 = word4
  
  // GK Section
  sheet2 = SpreadsheetApp.openById("1ybH-ggT5fmvsW3Pfp-qttsBhmRaabFy_2T5HzKGu7xk").getSheetByName("qna")
  gk1 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  gk2 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  gk3 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  gk4 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  gk5 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  gk6 = sheet2.getRange(Math.floor(Math.random() * 6189) + 2, 2, 1, 2).getValues()
  t.gk1 = gk1
  t.gk2 = gk2
  t.gk3 = gk3
  t.gk4 = gk4
  t.gk5 = gk5
  t.gk6 = gk6
  
  eval_t = t.evaluate();
  eval_t.setTitle('Quick Homepage');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
