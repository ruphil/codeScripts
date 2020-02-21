function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  // Thirukkural Section
  var thirukkuralSheet = SpreadsheetApp.openById("1BXc42CL0OOjU7fn2pTupBpAH2YFmSVkTAMD4a1TjxMs").getSheetByName("thirukkural");
  var tSRows = thirukkuralSheet.getLastRow();
  kural1 = thirukkuralSheet.getRange(Math.floor(Math.random() * (tSRows - 1) + 1), 2, 1, 5).getValues();
  t.kural1 = kural1;
  
  eval_t = t.evaluate();
  eval_t.setTitle('CivilServPrep');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getThirukkural(){
  var thirukkuralSheet = SpreadsheetApp.openById("1BXc42CL0OOjU7fn2pTupBpAH2YFmSVkTAMD4a1TjxMs").getSheetByName("thirukkural");
  var tSRows = thirukkuralSheet.getLastRow();
  var kural = thirukkuralSheet.getRange(Math.floor(Math.random() * (tSRows - 1) + 1), 2, 1, 5).getValues();
  return kural;
}

function getInterviewQuestions(){
  var iQuesSheet = SpreadsheetApp.openById("1RMJffdkN1QfUTfpy9sbOFWmuDUs-_sKtjJSRa-b9bu8").getSheetByName("ques");
  var iQuesLastRow = iQuesSheet.getLastRow();
  var iQues = iQuesSheet.getRange(Math.floor(Math.random() * (iQuesLastRow - 1) + 1), 1, 1, 3).getValues();
  Logger.log(iQues);
  return iQues;
}


function getLinks(dateArr){
//  var dateArr = [2019, 02, 16];
  
  const dailyAffairsFolderID = "1q2DAnUscAGJYuK4DhA94ApqP0TCgdqzh";
  const monthlyAffairsFolderID = "11EJ0mJgaP9ppvQuT20RCAZklgpXwv3k0";
  const dNARmFileID = "1ZkexqTAhEKagTSrZ871DiyG6eaKQ8kzC";
  const NAFileID = "1SqBQKJ15AYWVDmSJU7035OMEK_VTUbGM";

  var hinduPaper2TodaysDate = new Date(dateArr[0], dateArr[1], dateArr[2]);
  hinduPaper2TodaysDate.setDate(hinduPaper2TodaysDate.getDate() + 1);
      
  var dailyAffairs = dateArr[0].toString() + ("0" + (dateArr[1] + 1).toString()).slice(-2) + ("0" + dateArr[2].toString()).slice(-2) + " dailyAffairs.pdf";
  var hinduPaper1 = dateArr[0].toString() + ("0" + (dateArr[1] + 1).toString()).slice(-2) + ("0" + dateArr[2].toString()).slice(-2) + " hinduPaper.pdf";
  var hinduPaper2 = hinduPaper2TodaysDate.getFullYear().toString() + ("0" + (hinduPaper2TodaysDate.getMonth() + 1).toString()).slice(-2) + ("0" + (hinduPaper2TodaysDate.getDate()).toString()).slice(-2) + " hinduPaper.pdf";
  
  var previousMonth = new Date(dateArr[0], dateArr[1], dateArr[2]);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  var monthlyStorming = (previousMonth.getFullYear()).toString() + ("0" + (previousMonth.getMonth() + 1).toString()).slice(-2) + "dd monthlyStorming.pdf";

  var filesInfo = [];
  var dAFile;
  var daFileAvail = 0;
  try {
    dAFile = DriveApp.getFolderById(dailyAffairsFolderID).getFilesByName(dailyAffairs).next();
    daFileAvail = 1;
  } catch (e) {}
//  Logger.log(daFileAvail);
  
  if (!daFileAvail) dAFile = DriveApp.getFileById(dNARmFileID);
  
  var dAFileID = dAFile.getId();
  var dAFileName = dAFile.getName();
  filesInfo.push([dAFileID, dAFileName]);
  
  var fileNamesArry = [hinduPaper1, hinduPaper2];
  
  for (var i = 0; i < fileNamesArry.length; i++){
    var file;
    var fileAvail = 0;
    try {
      file = DriveApp.getFolderById(dailyAffairsFolderID).getFilesByName(fileNamesArry[i]).next();
      fileAvail = 1;
    } catch (e) {}
    
    if (!fileAvail) file = DriveApp.getFileById(NAFileID);
    
    var fileID = file.getId();
    var fileName = file.getName();
    filesInfo.push([fileID, fileName]);
  }
  
  var fileNamesArry = [monthlyStorming];
  
  for (var i = 0; i < fileNamesArry.length; i++){
    var file;
    var fileAvail = 0;
    try {
      file = DriveApp.getFolderById(monthlyAffairsFolderID).getFilesByName(fileNamesArry[i]).next();
      fileAvail = 1;
    } catch (e) {}
    
    if (!fileAvail) file = DriveApp.getFileById(NAFileID);
    
    var fileID = file.getId();
    var fileName = file.getName();
    filesInfo.push([fileID, fileName]);
  }
  
  return filesInfo;
}

function getDateRowPosition(dateArr, datesArry){
  for (var i = 0; i < datesArry.length; i++){
    if (dateArr[0] == datesArry[i][0].getFullYear() && dateArr[1] == datesArry[i][0].getMonth() && dateArr[2] == datesArry[i][0].getDate()){
      return i + 1;
    }
  }
  return 2;
}
