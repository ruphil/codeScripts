function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var sheet = SpreadsheetApp.openById("1aGJPUpx2yRiANecw1pWq35KFGOcLnCuYY-fHgJ4DT2k").getSheetByName("stories");
  var max_row = sheet.getLastRow();
//  Logger.log(max_row);
  
  var metadata = sheet.getRange(1, 1, max_row, 2).getValues();
  t.metadata = metadata;
  
  eval_t = t.evaluate();
  eval_t.setTitle('Hindi Stories Daily');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function fetch_story(id){
  var sheet = SpreadsheetApp.openById("1aGJPUpx2yRiANecw1pWq35KFGOcLnCuYY-fHgJ4DT2k").getSheetByName("stories");
  var title = sheet.getRange(id, 2, 1, 1).getValues();
  var story = sheet.getRange(id, 3, 1, 1).getValues();
  return [title[0][0], story[0][0]]
}

function translate_linebyline(id){
  var each_wrd_trans_paras = "";
  var full_trans_lines = "";
  
  var sheet = SpreadsheetApp.openById("1aGJPUpx2yRiANecw1pWq35KFGOcLnCuYY-fHgJ4DT2k").getSheetByName("stories");
  var story = sheet.getRange(id, 3, 1, 1).getValues();
  var paras = story[0][0].split("।।");
  paras.pop();
  for (var i = 0; i < paras.length - 1; i++){
    var para = paras[i];
    var words = para.split(" ");
    for (var j = 0; j < words.length; j++){
      each_wrd_trans_paras += words[j] + " (" + LanguageApp.translate(words[j], 'hi', 'en') + ")  ";
      Utilities.sleep(100);
    }
    var lines = para.split("।");
    for (var k = 0; k < lines.length - 1; k++){
      full_trans_lines += lines[k] + "। " + LanguageApp.translate(lines[k], 'hi', 'en') + ". ";
    }
  }
  return [each_wrd_trans_paras, full_trans_lines]
}
