function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Location Logger');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pushData(data){
  SpreadsheetApp.openById('1S0fQ5ySuvI6BmpDjGBmGqrGn8m0u_yD-8YsZZl_gYi8').getSheetByName('locs').appendRow([data[0], data[1] + ',' + data[2], data[3], data[4]]);
}
