function translate() {
  var Sprdsht = SpreadsheetApp.openById('1lKnEcEaXDEowV7D2CuchS2_FDzss37OX412EJQKsTbg');
  var storeSheet = Sprdsht.getSheetByName('store');
  var phrasesSheet = Sprdsht.getSheetByName('phrases');
  var lastRow = phrasesSheet.getLastRow();
  
  var i = 0;
  while (i == 0){
    var lastTrans = storeSheet.getRange(1, 1).getValue();
    if (lastTrans <= lastRow){
      var phraseNParams = phrasesSheet.getRange(lastTrans, 1, 1, 2).getValues();
    
      var phrase = phraseNParams[0][0];
      var fromLang = phraseNParams[0][1].split(',')[0];
      var toLang = phraseNParams[0][1].split(',')[1];
      
      var trans = LanguageApp.translate(phrase, fromLang, toLang);
      phrasesSheet.getRange(lastTrans, 3).setValue(trans);
      storeSheet.getRange(1, 1).setValue(lastTrans + 1);
    }
  }
}
