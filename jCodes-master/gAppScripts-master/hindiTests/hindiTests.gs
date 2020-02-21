function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  t.lastRow = SpreadsheetApp.openById('1tZwobYlxQZN2zToRPX9xZ5fPfdRa4cwloq4UnXr5b8k').getSheetByName('phrases').getLastRow();
  eval_t = t.evaluate();
  eval_t.setTitle('Hindi Tests');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getQuestion(){
  var qSheet = SpreadsheetApp.openById('1tZwobYlxQZN2zToRPX9xZ5fPfdRa4cwloq4UnXr5b8k').getSheetByName('phrases');
  var comptdRowsStr = SpreadsheetApp.openById('1tZwobYlxQZN2zToRPX9xZ5fPfdRa4cwloq4UnXr5b8k').getSheetByName('store').getRange(1, 1).getValue();
  var comptRows = comptdRowsStr.split(',');
  var comptQues = comptRows.length - 1;
  
  var lastRow = qSheet.getLastRow();
  
  var ranHelper1 = getRandomInt(1, lastRow);
  var ranHelper2 = getRandomInt(1, lastRow);
  var ranQue = (Math.random() < 0.2) ? getUniqueNo(comptRows) : getRandomInt(1, lastRow);
//  var ranQue = 1527;

  var rwno = ranQue;
  var helper1 = qSheet.getRange(ranHelper1, 1, 1, 2).getValues();
  var helper2 = qSheet.getRange(ranHelper2, 1, 1, 2).getValues();
  var ques = qSheet.getRange(ranQue, 1, 1, 2).getValues();
  return [ques, [helper1, helper2], rwno, comptQues];
}

function markDone(no){
  var storeSheet = SpreadsheetApp.openById('1tZwobYlxQZN2zToRPX9xZ5fPfdRa4cwloq4UnXr5b8k').getSheetByName('store');
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
  var meaning = LanguageApp.translate(word, 'hi', 'en')
  return meaning;
}

//function getMeaning(phrase){
//  var url = "https://script.google.com/macros/s/AKfycbyBojVlAY98PV_ybcconTjGpG8KLN5HiK_wlVIxM7aoFzzaENZd/exec";
//  var htmlStr = UrlFetchApp.fetch(url + "?inphrase=" + phrase).getContentText();
//  var htmlParts = htmlStr.split('zyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyz');
//  var meaning = htmlParts[1];
//  return meaning;
//}

function testScript(){
  
}
