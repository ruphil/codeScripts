const handlebars = require('handlebars');
const fs = require('fs');
const {google} = require('googleapis');
const privatekey = require('../essentials/token.json');

let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
);

function civilservices(res, id) {
  const source = fs.readFileSync('./rCivilServices/civilServices.html', 'utf8');
  var template = handlebars.compile(source);
  
  function getLastRow(callback){
  google.sheets('v4').spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: id,
    range: 'thirukkural!A1:A'
  }, function (_, response) {
      callback(response.data.values.length);
  });
  }

  getLastRow(function (lastRow){
        var randomNo = Math.floor(Math.random() * (lastRow - 1) + 1);
        var sheetRange = 'thirukkural!B' + randomNo + ':F' + randomNo;
        
        google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: id,
        range: sheetRange
        }, function (_, response) {
        
        var kural = response.data.values[0][2].replace(/(\r\n|\n|\r)/gm, "");
        var kuralWords = kural.split(" ").filter(function(e){return e});
        // console.log(kuralWords);
        var kuralLine1 = kuralWords.splice(0, 4).join(" ");
        var kuralLine2 = kuralWords.join(" ");
        data = {
              tkNo: response.data.values[0][0],
              tkAdhigaram: response.data.values[0][1],
              tkLine1: kuralLine1,
              tkLine2: kuralLine2,
              tkVilakkam: response.data.values[0][3]
          };
          var html = template(data);
          res.send(html)
        });
    });
}

function fileHelperCS(req, res){
    // var dateArr = [2019, 02, 16];
    // console.log(req.query.year);
    var dateArr = [parseInt(req.query.year), parseInt(req.query.month), parseInt(req.query.date)];

    var hinduPaper2TodaysDate = new Date(dateArr[0], dateArr[1], dateArr[2]);
    hinduPaper2TodaysDate.setDate(hinduPaper2TodaysDate.getDate() + 1);

    var dailyAffairs = dateArr[0].toString() + ("0" + (dateArr[1] + 1).toString()).slice(-2) + ("0" + dateArr[2].toString()).slice(-2) + " dailyAffairs.pdf";
    var hinduPaper1 = dateArr[0].toString() + ("0" + (dateArr[1] + 1).toString()).slice(-2) + ("0" + dateArr[2].toString()).slice(-2) + " hinduPaper.pdf";
    var hinduPaper2 = hinduPaper2TodaysDate.getFullYear().toString() + ("0" + (hinduPaper2TodaysDate.getMonth() + 1).toString()).slice(-2) + ("0" + (hinduPaper2TodaysDate.getDate()).toString()).slice(-2) + " hinduPaper.pdf";
    // console.log([dailyAffairs,hinduPaper1,hinduPaper2]);

    var previousMonth = new Date(dateArr[0], dateArr[1], dateArr[2]);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    var monthlyMags = (previousMonth.getFullYear()).toString() + ("0" + (previousMonth.getMonth() + 1).toString()).slice(-2) + "dd monthlyMags.pdf";
    var monthlyStorming = (previousMonth.getFullYear()).toString() + ("0" + (previousMonth.getMonth() + 1).toString()).slice(-2) + "dd monthlyStorming.pdf";

    google.drive('v3').files.list({
    auth: jwtClient,
    q: "'1q2DAnUscAGJYuK4DhA94ApqP0TCgdqzh' in parents",
    fields: 'files(id, name)',
    spaces: 'drive'
    }, function (_, response) {
    
    
    var dailyAffairsFiles = response.data.files;
    
    google.drive('v3').files.list({
    auth: jwtClient,
    q: "'11EJ0mJgaP9ppvQuT20RCAZklgpXwv3k0' in parents",
    fields: 'files(id, name)',
    spaces: 'drive'
    }, function (_, response) {

    var monthlyAffairsFiles = response.data.files;

    var allFiles = dailyAffairsFiles.concat(monthlyAffairsFiles);
    var totalFiles = allFiles.length;
    // console.log(allFiles);
    // console.log(allFiles[0].name);
    // console.log(allFiles[totalFiles-1].name);

    var dailyAffairsAvail = 0;
    var hinduOneAvail = 0;
    var hinduTwoAvail = 0;
    var monthlyMagsAvail = 0;
    var monthlyStormingAvail = 0;

    var dailyAffairsID, dailyAffairsName;
    var hinduOneID, hinduOneName;
    var hinduTwoID, hinduTwoName;
    var monthlyMagsID, monthlyMagsName;
    var monthlyStormingID, monthlyStormingName;

    for (var i = 0; i < totalFiles; i++){ 
      if(allFiles[i].name == dailyAffairs && dailyAffairsAvail == 0){
          dailyAffairsID = allFiles[i].id;
          dailyAffairsName = allFiles[i].name;
          dailyAffairsAvail = 1;
      }
      if(allFiles[i].name == hinduPaper1 && hinduOneAvail == 0){
          hinduOneID = allFiles[i].id;
          hinduOneName = allFiles[i].name;
          hinduOneAvail = 1;
      }
      if(allFiles[i].name == hinduPaper2 && hinduTwoAvail == 0){
          hinduTwoID = allFiles[i].id;
          hinduTwoName = allFiles[i].name;
          hinduTwoAvail = 1;
      }
      if(allFiles[i].name == monthlyMags && monthlyMagsAvail == 0){
          monthlyMagsID = allFiles[i].id;
          monthlyMagsName = allFiles[i].name;
          monthlyMagsAvail = 1;
      }
      if(allFiles[i].name == monthlyStorming && monthlyStormingAvail == 0){
          monthlyStormingID = allFiles[i].id;
          monthlyStormingName = allFiles[i].name;
          monthlyStormingAvail = 1;
      }
    }
    if (dailyAffairsAvail == 0) {dailyAffairsID = '1ZkexqTAhEKagTSrZ871DiyG6eaKQ8kzC';dailyAffairsName = 'dNARm.pdf'}
    if (hinduOneAvail == 0) {hinduOneID = '1SqBQKJ15AYWVDmSJU7035OMEK_VTUbGM';hinduOneName = 'NA.pdf'}
    if (hinduTwoAvail == 0) {hinduTwoID = '1SqBQKJ15AYWVDmSJU7035OMEK_VTUbGM';hinduTwoName = 'NA.pdf'}
    if (monthlyMagsAvail == 0) {monthlyMagsID = '1SqBQKJ15AYWVDmSJU7035OMEK_VTUbGM';monthlyMagsName = 'NA.pdf'}
    if (monthlyStormingAvail == 0) {monthlyStormingID = '1SqBQKJ15AYWVDmSJU7035OMEK_VTUbGM';monthlyStormingName = 'NA.pdf'}
    
    res.setHeader("Content-Type", "application/json");
    var fileIDJson = {
        "dailyAffairs": {
            id: dailyAffairsID,
            name: dailyAffairsName
        },
        "hinduPaperOne": {
            id: hinduOneID,
            name: hinduOneName
        },
        "hinduPaperTwo": {
            id: hinduTwoID,
            name: hinduTwoName
        },
        "monthlyMags": {
            id: monthlyMagsID,
            name: monthlyMagsName
        },
        "monthlyStorming": {
            id: monthlyStormingID,
            name: monthlyStormingName
        }
    };
    res.send(fileIDJson);
    });
  });
}

module.exports = {
    civilservices,
    fileHelperCS
}
