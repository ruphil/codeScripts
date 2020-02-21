function tPullCron(){
  const tPullStore_ID = '1-HmbR7wMLqal1The7XFevjS30QdgK_A5zbic5PohvA4';
  var storeValues = SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(2, 2, 2).getValues();
  var lastDate = parseDate(storeValues[0][0]);
  var endDate = parseDate(storeValues[1][0]);

  if (lastDate.getTime() <= endDate.getTime()){
    deleteAllTriggers();
    setTriggerAfterNMins(8);
    
    tDataStock.tDataStock(lastDate);
    
    deleteAllTriggers();
    setTriggerAfterNMins(1);
  }
  
  if (lastDate.getTime() >= endDate.getTime()){
    deleteAllTriggers();
  }
  
  if (lastDate.getTime() < endDate.getTime()){
    lastDate.setDate(lastDate.getDate() + 1);
    var dtStr = lastDate.getYear() + '$' + (lastDate.getMonth() + 1).toString() + '$' + lastDate.getDate();
    SpreadsheetApp.openById(tPullStore_ID).getSheetByName("tPull").getRange(2, 2).setValue(dtStr);
  }
}

function parseDate(dateStr){
  var dtParts = dateStr.split('$');
  return new Date(dtParts[0], dtParts[1] - 1, dtParts[2], 12, 0 , 0);
}

function setTriggerAfterNMins(mins){
  var todayDateTime = new Date();
  todayDateTime.setMinutes(todayDateTime.getMinutes() + mins);
  ScriptApp.newTrigger('tPullCron').timeBased().at(todayDateTime).create();
}

function deleteAllTriggers(){
  var triggersLength = ScriptApp.getProjectTriggers().length;
  while (triggersLength--){
    ScriptApp.deleteTrigger(ScriptApp.getProjectTriggers()[triggersLength]);
  }
}

