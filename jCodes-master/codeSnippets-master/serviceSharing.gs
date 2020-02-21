function doGet(e) {
  var phrase = e.parameter.inphrase;
  var transPhrase = LanguageApp.translate(phrase, 'hi', 'en');
  var codeBreaker = "zyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyz";
  var output = HtmlService.createHtmlOutput().setContent(codeBreaker + transPhrase + codeBreaker);
  return output;
}

function getMeaning(phrase){
  var url = "https://script.google.com/macros/s/AKfycbyBojVlAY98PV_ybcconTjGpG8KLN5HiK_wlVIxM7aoFzzaENZd/exec";
  var htmlStr = UrlFetchApp.fetch(url + "?inphrase=" + phrase).getContentText();
  var htmlParts = htmlStr.split('zyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcbaabcdefghijklmnopqrstuvwxyz');
  var meaning = htmlParts[1];
  return meaning;
}
