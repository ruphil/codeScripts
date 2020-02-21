function createTDataTemplate() {
  var folderID = '1i-A_6As0d3UPQbHkEKHUlISHRvoTVdO4';
  var startDate = new Date(2016, 00, 01, 12, 0, 0);
  var endDate = new Date(2017, 00, 01, 12, 0, 0);
  
  var resource = {
    title: 'tDataStockTemplate',
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: folderID }]
  };
  var fileID = Drive.Files.insert(resource).id;
  var sheet = SpreadsheetApp.openById(fileID).getSheets()[0];
  sheet.setName("tData");
  
  var dates = [];
  var currentDate = startDate;
  while (currentDate.getTime() <= endDate.getTime()){
    dates.push([startDate.toLocaleString('en-US')]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  var length = dates.length;
  sheet.getRange(1, 1).setValue('datesUnique');
  sheet.getRange(2, 1, length).setValues(dates);
}

function testScript(){
  
}
