function mail_birthDay() {
  
  var todayDate = new Date().toISOString().slice(5,10).split("-").reverse().join("+");
  
  var sheet = SpreadsheetApp.openById("19dLCMJqH05yGhTY3I22bRX0hjexPQDpf61S-qkyQLsY").getSheetByName("birthdays")
  var max_row = sheet.getLastRow()
  
  var name_birthday = "No Loved Ones"
  var date_birthday = "Birthday Today"
  
  var data = sheet.getRange(2, 2, max_row - 1, 3).getValues();
  Logger.log(data);
  for (var i = 0; i < data.length; i++){
    if(data[i][0] == todayDate){
      name_birthday = data[i][2];
      date_birthday = todayDate.split("+").join("-") + "-" + data[i][1];
      break;
    }
  }
  
  if(name_birthday!="No Loved Ones" && date_birthday!="Birthday Today"){
    var body = "Name: " + name_birthday + "\nDate: " + date_birthday
    MailApp.sendEmail("rukmangadanies@gmail.com, rukmangadan91@gmail.com", "LovedOne's BirthDay Today", body)
  }
}
