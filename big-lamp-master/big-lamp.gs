function doGet(e) {
  //Phase zero -> Login Page, Phase one -> MACID Info Page, Phase two -> Snaps Page
  var url = ScriptApp.getService().getUrl();
  var t = HtmlService.createTemplateFromFile('frontend');
  t.url = url;
  t.params = JSON.stringify(e);
  
  t.phase = 0;
  if (e.parameter.user == "controller" && e.parameter.pass == "philosopher" && e.parameter.phase == 1){
    t.phase = 1
  }else if (e.parameter.user == "controller" && e.parameter.pass == "philosopher" && e.parameter.phase == 2){
    t.phase = 2
    t.initial = true;
    t.macid = e.parameter.macid
    if (typeof (e.parameter.servertime) !== 'undefined'){
      t.initial = false;
      t.servertime = e.parameter.servertime;
      t.servertimebool = true;
      t.numberbool = false;
    }else if (typeof (e.parameter.number) !== 'undefined') {
      t.initial = false;
      t.number = e.parameter.number;
      t.servertimebool = false;
      t.numberbool = true;
    }
  }else if (e.parameter.user == "controller" && e.parameter.pass == "philosopher" && e.parameter.phase == 3){
    t.phase = 3;
    t.macid = e.parameter.macid;
    t.start = e.parameter.start;
  }
  
  eval_t = t.evaluate();
  eval_t.setTitle('Big-Lamp');
  return eval_t.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  if (e.parameter.credential == "controller@philosopher"){
    // removing from big-lamp if the limit has reached
    limit = 50000;
    var sheet = SpreadsheetApp.openById('105mQKulJrdbSR5-lSh84aLRFki9SU4n2lPz8-iZK66U').getSheetByName("big-lamp");
    var lastRow = sheet.getLastRow();
    if (lastRow > limit){
      deletefirstNrows(1);
    }
    
    if(blackListMACID(e.parameter.macid)) return ContentService.createTextOutput("not done");
    
    // inserting into big-lamp
    var d = new Date();
    var servertime = ISODateString(d);
    var folder = DriveApp.getFolderById("112JeJ05E4v_P9blT5mNSKahB3Q_clxT8");
    var file = folder.createFile('snap', e.parameter.snap);
    var fileId = file.getId();
    sheet.appendRow([servertime, e.parameter.macid, e.parameter.username, fileId, e.parameter.systym]);
    return ContentService.createTextOutput("done");
  }else {
    return ContentService.createTextOutput("not done");
  }
}

function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())
}

// Add MACIDs here to blacklist...
function blackListMACID(macid){
  //var macIDs = ["Saab", "Volvo", "40:8d:5c:f5:59:7d"];
  var macIDs = ["Saab", "Volvo"];
  for (var i = 0, len = macIDs.length; i < len; i++) {
    if (macIDs[i] == macid) return true;
  }
  return false;
}

function deleteMACID(macid){
  //var macid = "jack";
  var sheet = SpreadsheetApp.openById('105mQKulJrdbSR5-lSh84aLRFki9SU4n2lPz8-iZK66U').getSheetByName("big-lamp");
  var lastRow = sheet.getLastRow();
  
  for( var i = lastRow; i > 1; i-- ) {
    var data_macid_user_file = sheet.getRange(i, 2, 1, 3).getValues();  
    var macidinstance = data_macid_user_file[0][0].toString();
    if (macid == macidinstance){
      DriveApp.getFileById(data_macid_user_file[0][2]).setTrashed(true);
      sheet.deleteRow(i);
    }
  }
}

function deletefirstNrows(n){
  var sheet = SpreadsheetApp.openById('105mQKulJrdbSR5-lSh84aLRFki9SU4n2lPz8-iZK66U').getSheetByName("big-lamp");
  for( var i = n + 1; i > 1; i-- ) {
      var fileID = sheet.getRange(i, 4, 1, 1).getValues();  
      DriveApp.getFileById(fileID[0][0]).setTrashed(true);
      sheet.deleteRow(i);
  }
}

function console(){
  //deletefirstNrows(1);
  //deleteMACID("3c:a0:67:cd:ef:8f");
  Logger.log("hey");
}
