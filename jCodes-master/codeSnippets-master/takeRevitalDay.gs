function takeRevitalDay() {
  var today = new Date();
//  var today = new Date(2018, 02, 01);
//  Logger.log(today);
  
  var revitalDay = today.getDate() % 6; // Taking Revital once every 6 days,,,
//  revitalDay = 0;  
  
  if(revitalDay == 0){
    mailIt();
  } else if (today.getDate() == 1 && today.getMonth() == 2){ // Taking Revital on March 01,,,
    mailIt();
  }
}

function mailIt(){
  var body = "Take One Revital Pill";
  MailApp.sendEmail("rukmangadanies@gmail.com, rukmangadan91@gmail.com", "Take Revital", body);
}
