var sheetID = '1AGLsHbk3-OFysAafWWGMJIwB9tvAHzs-M7-ylBqtiSk';

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontendMorse');
  eval_t = t.evaluate();
  eval_t.setTitle('-- --- .-. ... .');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPhrase(){
  var sprdSht = SpreadsheetApp.openById(sheetID);
  var qSheet = sprdSht.getSheetByName('ques');
  var lastRow = qSheet.getLastRow();
  var ranQue = getRandomInt(1, lastRow);
  
  var ques = qSheet.getRange(ranQue, 1, 1, 2).getValues()[0].join(" ");
  return ques;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
