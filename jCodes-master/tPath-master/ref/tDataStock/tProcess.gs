function tProcess() {
  var symbolsID = '1kbr8fmodKkFNIum1iDcpM0ClOCAiBm8FC-jbFjnYmf8';
  var folderID = '1In-acruH-ujox4ta9RDU3FR0UfFYCfS1';

  var url = 'https://www.nseindia.com/content/historical/EQUITIES/2018/SEP/cm17SEP2018bhav.csv.zip';
  var zipBlob = UrlFetchApp.fetch(url).getBlob();
  var csvBlob = Utilities.unzip(zipBlob);
  var csvString = csvBlob[0].getDataAsString();
  var lines = csvString.split('\n');
  var num_lines = lines.length - 1;
  var colNames = lines[0];
  lines.shift();
  
  var time = lines[0].split(',')[10];
  
  if (colNames == "SYMBOL,SERIES,OPEN,HIGH,LOW,CLOSE,LAST,PREVCLOSE,TOTTRDQTY,TOTTRDVAL,TIMESTAMP,TOTALTRADES,ISIN,"){
    for (var i=0; i < num_lines; i++){
      var temp_line = lines[i].split(',');
      var sym = temp_line[0];
      var openToTrades = temp_line.slice(2,10);
      openToTrades.push(temp_line[11]);
      
      Logger.log([sym, time, openToTrades]);
    }
  } else {
    Logger.log("send Need Attention Mail ");
  }
  
  var sheet = SpreadsheetApp.openById(symbolsID).getSheetByName('syms');
  var avail_syms = sheet
  SpreadsheetApp.openById(symbolsID).copy('jack');
  
  
  
}

