function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Jumbled Words');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function arrange(countStr) {
  countStr = countStr.substring(0, countStr.length - 1) + "e";
  var words = getMatch(countStr)
  return JSON.stringify(words);
}

function getMatch(searchString) {
  var ss = SpreadsheetApp.openById('18Pylx3w3PKKvryQr-IXdzIAcC8yl28oCyHRwj64wptY').getSheetByName('words');
  var values = ss.getDataRange().getValues();
  
  var matches = []
  for(var i=0, iLen=values.length; i<iLen; i++) {
    if(values[i][1] == searchString) {
      matches.push(values[i][0]);
    }
  }
  return matches;
}
