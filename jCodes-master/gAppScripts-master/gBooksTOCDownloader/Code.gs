function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  template = t.evaluate();
  return template.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
