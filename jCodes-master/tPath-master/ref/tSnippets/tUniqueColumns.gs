function tUniqueColumns() {
  const folder_ID = '1w6fLbJ48REwsqW5UFR9OwAL7axuKpEoK';
  var files = DriveApp.getFolderById(folder_ID).getFiles();
  
  var columnNames = [];
  while(files.hasNext()){
    var file = files.next();
    var fileName = file.getName();
    if (fileName.indexOf('Cron') !== -1){
      var fileID = DriveApp.getFolderById(folder_ID).getFilesByName(fileName).next().getId();
      var sheet = SpreadsheetApp.openById(fileID).getSheetByName('pullCron');
      
      var lastColumn = sheet.getLastColumn();
      var data = sheet.getRange(4, 1, 1, lastColumn).getValues();
//      Logger.log(data[0]);
      var uniqueData = data[0].filter(onlyUnique);
    }
    columnNames.push(uniqueData);
    Logger.log(uniqueData);
  }
  var uniquecolumnNames = columnNames.filter(onlyUnique);
//  Logger.log(uniquecolumnNames);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
