function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Jumbled Words');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function get_db() {
  var ss = SpreadsheetApp.openById('18Pylx3w3PKKvryQr-IXdzIAcC8yl28oCyHRwj64wptY').getSheetByName('words');
  var max_row = ss.getMaxRows();
  var values = ss.getRange(1, 1, max_row).getValues();
  return values;
}
