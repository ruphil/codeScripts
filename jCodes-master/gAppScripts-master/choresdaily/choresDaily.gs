function doGet(e) {
  var t = HtmlService.createTemplateFromFile('frontend');
  
  var todayDate = new Date().toISOString().slice(5,10).split("-").reverse().join("+");
  
  var sheet = SpreadsheetApp.openById("1FWH600c2olMkEtALmmTgp8N5iVXU8M0usrWIuF1L0I0").getSheetByName("birthdays")
  var max_row = sheet.getLastRow()
  
  t.name_birthday = "No Loved Ones"
  t.date_birthday = "Birthday Today"
  
  var data = sheet.getRange(2, 2, max_row - 1, 3).getValues();
//  Logger.log(data);
  for (var i = 0; i < data.length; i++){
    if(data[i][0] == todayDate){
      t.name_birthday = data[i][2];
      t.date_birthday = todayDate.split("+").join("-") + "-" + data[i][1];
      break;
    }
  }
  
  var sheet = SpreadsheetApp.openById("1tlTN4gnwtIudxq8i2UjmVhvGLsTcCbOaalU6-dwTLbM").getSheetByName("bookmarks")
  var max_row = sheet.getLastRow()
  var data = sheet.getRange(1, 1, max_row, 2).getValues();
  t.bookmarks = data
  
  eval_t = t.evaluate();
  eval_t.setTitle('Remainder Daily');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function add_weight(data){
  var sheet = SpreadsheetApp.openById("1goM0PZRcY1Obc60vdI8mU5cwWjl9K3Ia8wlsyewCd-o").getSheetByName("weight");
  var max_row = sheet.getLastRow();
  var last_date = sheet.getRange(max_row, 1, 1, 1).getValues()[0][0];
  
  var date = new Date();
  var date_today = new Date(date);
  
  date.setDate(date.getDate() - 1);
  var date_yesterday = date;
  
  var dd = date_today.getDate();
  var mm = date_today.getMonth() + 1; //January is 0!
  var yyyy = date_today.getFullYear();
  
  var dd_y = date_yesterday.getDate();
  var mm_y = date_yesterday.getMonth() + 1; //January is 0!
  var yyyy_y = date_yesterday.getFullYear();
  
  var today = dd + "/" + mm + "/" + yyyy
  var yesterday = dd_y + "/" + mm_y + "/" + yyyy_y
  
  var weight = data[0]
  var passwd = data[1]
  if(today != last_date && passwd == "philosopher"){
    if (last_date == yesterday) {
      sheet.appendRow([today, weight]);
      sheet.getRange(max_row + 1, 1, 1, 1).setNumberFormat("@");
      return true
    } else {
      var last_date = sheet.getRange(max_row, 1, 1, 1).getValues()[0][0];
      var last_weight = sheet.getRange(max_row, 2, 1, 1).getValues()[0][0];
      
      var date_today = new Date();
      var dd_cd = date_today.getDate();
      var mm_cd = date_today.getMonth() + 1; //January is 0!
      var yyyy_cd = date_today.getFullYear();
      
      var current_date = dd_cd + "/" + mm_cd + "/" + yyyy_cd
      
      var avg_count = 0;
      var dates_array = []
      while (current_date != last_date){
        
        dates_array.push(current_date)
        
        date_today.setDate(date_today.getDate() - 1);
        var dd_cd = date_today.getDate();
        var mm_cd = date_today.getMonth() + 1; //January is 0!
        var yyyy_cd = date_today.getFullYear();
        current_date = dd_cd + "/" + mm_cd + "/" + yyyy_cd
        
        avg_count += 1;
      }
      dates_array.reverse();
      
      var weight_array = [];
      for (var i=0; i < avg_count; i++){
        weight_temp = (last_weight + (weight - last_weight) * (i + 1) * getRandomArbitrary(0.7, 1.3) / avg_count).toFixed(1);
        weight_array.push(weight_temp);
      }
      Logger.log(avg_count);
      Logger.log(dates_array);
      Logger.log(weight_array);
      
      var max_row = sheet.getLastRow();
      for (var i=0; i < avg_count; i++){
        sheet.appendRow([dates_array[i], weight_array[i]]);
      }
      
      sheet.getRange(max_row + 1, 1, avg_count, 1).setNumberFormat("@");
      
      return true
    }
  } else {
    return false
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function lock_check(){
  var sheet = SpreadsheetApp.openById("1goM0PZRcY1Obc60vdI8mU5cwWjl9K3Ia8wlsyewCd-o").getSheetByName("weight");
  var max_row = sheet.getLastRow();
  var last_date = sheet.getRange(max_row, 1, 1, 1).getValues()[0][0];
  
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!
  var yyyy = date.getFullYear();
  
  var today = dd + "/" + mm +"/" + yyyy
  
  var lockit = 0
  var weight = null
  if(today == last_date){
    lockit = 1
    weight = sheet.getRange(max_row, 2, 1, 1).getValues()[0][0];
  }
  return [lockit, weight]
}

function get_chart_data(){
    var sheet = SpreadsheetApp.openById("1goM0PZRcY1Obc60vdI8mU5cwWjl9K3Ia8wlsyewCd-o").getSheetByName("weight")
    var max_row = sheet.getLastRow()
    var data = sheet.getRange(1, 1, max_row, 2).getValues();
    return data
}
