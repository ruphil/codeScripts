function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('TTS Mobile Reader');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}