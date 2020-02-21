function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  eval_t = t.evaluate();
  eval_t.setTitle('Oppurtunity Explorer');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function evaluatesessionRtryLoggingIn(dat){
  if (dat[0] == "jack" && dat[1] == "pack") return true;
  return false;
}

function getConsole(console){  
  if (console == "login"){
    var t = HtmlService.createTemplateFromFile('loginConsole').getRawContent();
    return t;
  } else if (console == "main"){
    var t = HtmlService.createTemplateFromFile('mainConsole').getRawContent();
    return t;
  }
}
