function tLinkChecker() {
  var sheet_Logger_ID = '1JRK1EQvNJLLzjeVr3eTwtLpg2Vpp1phLXSBqrpP44p0';
  var today = new Date();
  var day = pad(today.getDate(), 2);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var month = monthNames[today.getMonth()];
  var year = today.getYear().toString();
  
  var url = "https://www.nseindia.com/content/historical/EQUITIES/" + year + "/" + month + "/cm" + day + month + year + "bhav.csv.zip";
  
  var successMsg;
  try {
    UrlFetchApp.fetch(url);
    successMsg = "Its really Success";
  } catch (err) {
    successMsg = "Not Succeeded Yet";
  }
  SpreadsheetApp.openById(sheet_Logger_ID).getSheetByName('linkCheck').appendRow([today, successMsg]);
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
