const fs = require('fs');
const {google} = require('googleapis');
const privatekey = require('../essentials/token.json');
const email = require('mailer');

let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets', 
  'https://www.googleapis.com/auth/drive', 
  'https://www.googleapis.com/auth/gmail.send']
);

const storageSheetID = '1mtSszhPsqU3wCb9B7FP9blGj9T5iVmKiboIsBde0Wq0';
const storageParentID = '1x3lmLuHp1RVzSSHRGvSgJFTr6CXGK9rc';

// ---------------------------------- Index Files ----------------------------------

function civilServicesMain(req, res) {
    res.sendFile('civilServicesV2.html', {root: __dirname });
}

function contentManagerMain(req, res){
    res.sendFile('contentManager.html', {root: __dirname });
}

// ---------------------------------- Login Helper Functions ----------------------------------

function contentManagerAjaxHelper(req, res){
    if (req.body.type == "usercheck"){
        userCheck(req, res);
    } else if (req.body.type == "otpcheck"){
        otpCheck(req, res);
    }
}

function checkValidUser(req, res, data){
    if (req.body.sessionID == data[0][0]){
        var mainConsole = fs.readFileSync('./rCivilServicesV2/managerMainConsole.xml', 'utf-8');
        var jsonData = {
            validUser: true,
            html: mainConsole
        }
        res.json(jsonData);
    } else {
        generateOTP();
        var loginSection = fs.readFileSync('./rCivilServicesV2/login.xml', 'utf-8');
        var jsonData = {
            validUser: false,
            html: loginSection
        }
        res.json(jsonData);
    }
}

function userCheck(req, res){
    getSheetValue(req, res, storageSheetID, 'session!A1', checkValidUser);
}

function getSheetValue(req, res, id, range, callback){
    google.sheets('v4').spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: id,
        range: range
    }, function (_, response) {
      callback(req, res, response.data.values);
  });
}

function randomGenerator(length){
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function setSheetValue(id, range, otp){
    let values = [[otp]];
    const resource = {
        values
    };
    let valueInputOption = 'RAW';
    google.sheets('v4').spreadsheets.values.update({
        auth: jwtClient,
        spreadsheetId: id,
        range: range,
        valueInputOption: valueInputOption,
        resource: resource,
    });
}

function sendEmail(otp){
    email.send({
        host : "smtp.gmail.com",
        port : "465",
        ssl : true,
        to : "rukmangadanies@gmail.com",
        from : "rukmangadan91@gmail.com",
        subject : "OTP - Content Manager Console",
        body: "Your OTP is "+ otp,
        authentication : "login",
        username : 'rukmangadan91@gmail.com',
        password : 'mrqvukedlaleccjr'
    }, function(){});
}

function generateOTP(){
    var otp = randomGenerator(6);
    console.log(otp);
    setSheetValue(storageSheetID, 'otp!A1', otp);
    sendEmail(otp);
}

function checkValueOtp(req, res, data){
    if (req.body.otp == data[0][0]){
        var sessionID = randomGenerator(32);
        console.log(sessionID);
        setSheetValue(storageSheetID, 'session!A1', sessionID);
        var mainConsole = fs.readFileSync('./rCivilServicesV2/managerMainConsole.xml', 'utf-8');
        var jsonData = {
            otpValid: true,
            sessionID: sessionID,
            html: mainConsole
        }
        res.json(jsonData);
    } else {
        var loginSection = fs.readFileSync('./rCivilServicesV2/login.xml', 'utf-8');
        var jsonData = {
            otpValid: false,
            html: loginSection
        }
        generateOTP();
        res.json(jsonData);
    }
}

function otpCheck(req, res){
    getSheetValue(req, res, storageSheetID, 'otp!A1', checkValueOtp);
}

// ---------------------------------- File Uploading Functions ----------------------------------

function uploadFiles(req, res){
    var fileName = req.body.name;
    var fileContent = req.body.content;
    var sheetID = req.body.sheetID;

    if (!sheetID) {
        createSheet(req, res, fileName, fileContent);
    } else {
        updateSheet(req, res, sheetID, fileName, fileContent);
    }
}

function createSheet(req, res, fileName, fileContent){
    var resource = {
        auth: jwtClient,
        resource: {
            properties: {
                title: fileName
            }
        }
    };

    google.sheets('v4').spreadsheets.create(resource, function (err, resp){
        var ID = resp.data.spreadsheetId;
        console.log(ID);
        // fs.writeFile('./response', JSON.stringify(resp), function (){});

        // adding a sheet
        var resource = {
            auth: jwtClient,
            spreadsheetId: ID,
            resource: {
                requests: [{
                    addSheet: {
                        properties: {
                        title: "fileContent",
                        gridProperties: {
                            rowCount: 5000,
                            columnCount: 1
                    }}}}]}
        };

        google.sheets('v4').spreadsheets.batchUpdate(resource, function (err, resp){
            // fs.writeFile('./response', JSON.stringify(resp), function (){});
            // sheetID = resp.data.replies[0].addSheet.properties.sheetId;  
            // console.log(sheetID);

            // removing the default sheet
            var resource = {
                auth: jwtClient,
                spreadsheetId: ID,
                resource: {
                    requests: [{
                        deleteSheet: {
                            sheetId: 0
                        }
                }]}
            }

            google.sheets('v4').spreadsheets.batchUpdate(resource, function (){});
        });

        // write permission to anyone
        var resource = {
            auth: jwtClient,
            fileId: ID,
            resource: {
                role: "writer",
                type: "anyone"
            }
        };
        google.drive('v3').permissions.create(resource, function (){});

        // transfering ownership to rukmangadanies@gmail.com
        var resource = {
            auth: jwtClient,
            fileId: ID,
            transferOwnership: true,
            resource: {
                emailAddress: "rukmangadanies@gmail.com",
                role: "owner",
                type: "user"
            }
        };
        google.drive('v3').permissions.create(resource, function (){});

        // moving file to required folder
        var resource = {
            auth: jwtClient,
            fileId: ID,
            addParents: [storageParentID]
        };
        google.drive('v3').files.update(resource, function (){});

        res.json({
            creationSuccess: true,
            sheetID: ID
        });
    });
}

function updateSheet(req, res, sheetID, fileName, fileContent){
    var currentChunkInstance = req.body.currentChunkInstance;
    var range = 'fileContent!A' + currentChunkInstance + ':A' + currentChunkInstance;
    // console.log(range);

    google.sheets('v4').spreadsheets.values.update({
        auth: jwtClient,
        spreadsheetId: sheetID,
        range: range,
        valueInputOption: 'RAW',
        resource:{
            values: [[fileContent]]
        }
    });

    // var resource = {
    //     auth: jwtClient,
    //     spreadsheetId: sheetID,
    //     range: range,
    //     valueInputOption: 'RAW',
    //     resource:{
    //         values: [[fileContent]]
    //     }
    // };
    // google.sheets('v4').spreadsheets.values.append(resource, function (err, resp){
    //     // console.log(resp.statusText);
    // });

    if(req.body.lastChunk == "yes"){
    
        var resource = {
            auth: jwtClient,
            spreadsheetId: storageSheetID,
            resource: {
                requests: [{
                    insertDimension: {
                        range: {
                            sheetId: 0,
                            dimension: "ROWS",
                            startIndex: 1,
                            endIndex: 2
                        }
                    }
            }]}
        }

        google.sheets('v4').spreadsheets.batchUpdate(resource, function (err, resp){
            //    console.log(err || resp);
               var now = new Date();
               var resource = {
                    auth: jwtClient,
                    spreadsheetId: storageSheetID,
                    range: 'files!A2',
                    valueInputOption: 'RAW',
                    resource:{
                        values: [[fileName, sheetID, "completed", now.toLocaleDateString('en-IN'), now.getTime()]]
                    }
                };
                google.sheets('v4').spreadsheets.values.append(resource, function (err, resp){
                    // console.log(resp.statusText);
                });


        });
    }

    res.json({
        uploadSuccess: true,
        sheetID: sheetID
    });
}

// ---------------------------------- File Listing Functions ----------------------------------

function contentManagerFileHandler(req, res){
    if (req.body.mode == "listfiles"){
        console.log(req.body.mode);
        listFiles(req, res);
    } else if (req.body.mode == "upload"){
        console.log(req.body.mode);
        uploadFiles(req, res);
    }
}

function returnFileList(req, res, data){
    var fileList = {
        files: data
    };
    res.json(fileList);
}

function listFiles(req, res){
    getSheetValue(req, res, storageSheetID, 'files!A2:A', returnFileList);
}


// ----------------------------------- fileFetch Functions -------------------------------------------

// Example -- URLs: 
// https://8080-dot-3476156-dot-devshell.appspot.com/fetchfile?filename=rukmangadan.pdf&mode=attachment
// https://8080-dot-3476156-dot-devshell.appspot.com/fetchfile?filename=rukmangadan.pdf&mode=inline

function fetchFile(req, res){
    var fileName = req.query.filename;
    var mode = req.query.mode;
    console.log(fileName);

    if(!fileName){
        res.json("pass a filename");
        return;
    }

    google.sheets('v4').spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: storageSheetID,
            range: 'files!A1:A'
        }, function (_, response) {
            for (var i = 0; i < response.data.values.length; i++){
                if(fileName == response.data.values[i]){
                    var index = i+1;
                    var range = 'files!B' + index;
                    console.log(range);
                    google.sheets('v4').spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: storageSheetID,
                        range: range
                    }, function (_, response) {
                        var fileSheetId = response.data.values[0][0];
                        console.log(fileSheetId);

                        google.sheets('v4').spreadsheets.values.get({
                            auth: jwtClient,
                            spreadsheetId: fileSheetId,
                            range: 'fileContent!A1:A'
                        }, function (_, response) {

                            var responseStrJoined = response.data.values.join("");
                            var fileContentBase64 = decodeURIComponent(responseStrJoined);
                            console.log(fileContentBase64.length);
                            // console.log(fileContentBase64);
                            console.log('made base64string');

                            var buffer = Buffer.from(fileContentBase64, 'base64');

                            res.setHeader('Content-Length', buffer.length);
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', `${mode}; filename="${fileName}"`);
                            res.end(buffer);
                            console.log("buffer sent");
                        });
                    });
                    return;
                }
            } res.json({
                fileAvailabe: false
            });
    });
    
}



module.exports = {
    civilServicesMain,
    contentManagerMain,
    contentManagerAjaxHelper,
    contentManagerFileHandler,
    fetchFile
}
