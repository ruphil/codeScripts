var sheetID = '1AGLsHbk3-OFysAafWWGMJIwB9tvAHzs-M7-ylBqtiSk';

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  t.lastRow = SpreadsheetApp.openById(sheetID).getSheetByName('ques').getLastRow();
  eval_t = t.evaluate();
  eval_t.setTitle('GK Tests');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getQuestion(){
  var sprdSht = SpreadsheetApp.openById(sheetID);
  var qSheet = sprdSht.getSheetByName('ques');
  var comptdRowsStr = sprdSht.getSheetByName('store').getRange(1, 1).getValue();
  var comptRows = comptdRowsStr.split(',');
  var comptQues = comptRows.length - 1;
  
  var lastRow = qSheet.getLastRow();
  
  var ranHelper1 = getRandomInt(1, lastRow);
  var ranHelper2 = getRandomInt(1, lastRow);
  var ranHelper3 = getRandomInt(1, lastRow);
  
  var ranQue = (Math.random() < 0.2) ? getUniqueNo(comptRows) : getRandomInt(1, lastRow);
//  var ranQue = 1527;

  var rwno = ranQue;
  var Anshelper1 = qSheet.getRange(ranHelper1, 2).getValue();
  var Anshelper2 = qSheet.getRange(ranHelper2, 2).getValue();
  var Anshelper3 = qSheet.getRange(ranHelper3, 2).getValue();
  
  var ques = qSheet.getRange(ranQue, 1, 1, 2).getValues();
  return [ques, [Anshelper1, Anshelper2, Anshelper3], rwno, comptQues];
}

function markDone(no){
  var storeSheet = SpreadsheetApp.openById(sheetID).getSheetByName('store');
  var storeStr = storeSheet.getRange(1, 1).getValue();
  var comptRows = storeStr.split(',');
  
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (parseInt(this[i]) == parseInt(obj)) {
            return true;
        }
    }
    return false;
  }
  
  var uniqueNum = 0;
  while (uniqueNum == 0){
    if(!comptRows.contains(no)){
      uniqueNum = 1;
    }
  }
  
  if (uniqueNum){
    storeStr += no + ',';
    storeSheet.getRange(1, 1).setValue(storeStr);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueNo(comptRows){
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (parseInt(this[i]) == parseInt(obj)) {
            return true;
        }
    }
    return false;
  }
  
  var ranQueTemp;
  var uniqueNum = 0;
  while (uniqueNum == 0){
    ranQueTemp = getRandomInt(1, 5749);
    if(!comptRows.contains(ranQueTemp)){
      uniqueNum = 1;
    }
  }
  return ranQueTemp;
}

function getMeaning(word){
  var meaning = LanguageApp.translate(word, 'en', 'ta')
  return meaning;
}

function testScript(){
  
}
