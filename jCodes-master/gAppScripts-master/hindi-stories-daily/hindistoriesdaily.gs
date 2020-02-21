function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var sheet = SpreadsheetApp.openById("1eJ6jHAW1lhI3gwNA8kC8vJ2kjAlfuZ_xmE6f_hMInoM").getSheetByName("stories");
  var max_row = sheet.getLastRow();
//  Logger.log(max_row);
  
  var row = sheet.getRange(Math.floor(Math.random() * (max_row - 1)) + 2, 2, 1, 5).getValues();
  while (row[0][4] != "completed"){
    row = sheet.getRange(Math.floor(Math.random() * (max_row - 1)) + 2, 2, 1, 5).getValues();
  }
  t.raw_row = row;
  
//  // Translating text
  var each_wrd_trans_paras = "";
  var full_trans_paras = "";
  var paras = row[0][2].split("।।");
  for (var i = 0; i < paras.length - 1; i++){
    var words = paras[i].split(" ");
    for (var j = 0; j < words.length; j++){
      each_wrd_trans_paras += words[j] + " (" + LanguageApp.translate(words[j], 'hi', 'en') + ")  ";
      Utilities.sleep(100);
    }
    each_wrd_trans_paras += "।।";
    full_trans_paras += LanguageApp.translate(paras[i], 'hi', 'en') + "।।";
  }
  
  t.each_wrd_trans_paras = each_wrd_trans_paras;
  t.full_trans_paras = full_trans_paras;
  
  eval_t = t.evaluate();
  eval_t.setTitle('Hindi Stories Daily');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
