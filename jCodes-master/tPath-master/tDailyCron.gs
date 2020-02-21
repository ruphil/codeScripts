function tDailyCron(){
  var today = new Date();
//  today.setDate(today.getDate() - 1);
  
  deleteAllTriggers();
  setTriggerAfterNMins(8);
  
  tDataStock.tDataStock(today);
  
  deleteAllTriggers();
  addDailyCronTrigger();
}

function setTriggerAfterNMins(mins){
  var todayDateTime = new Date();
  todayDateTime.setMinutes(todayDateTime.getMinutes() + mins);
  ScriptApp.newTrigger('tDailyCron').timeBased().at(todayDateTime).create();
}

function deleteAllTriggers(){
  var triggersLength = ScriptApp.getProjectTriggers().length;
  while (triggersLength--){
    ScriptApp.deleteTrigger(ScriptApp.getProjectTriggers()[triggersLength]);
  }
}

function addDailyCronTrigger(){
  var today = new Date();
  today.setDate(today.getDate() + 1);
  var date = new Date(today.getYear(), today.getMonth(), today.getDate(), 18, 0, 0);
  ScriptApp.newTrigger('tDailyCron').timeBased().at(date).create();
}
