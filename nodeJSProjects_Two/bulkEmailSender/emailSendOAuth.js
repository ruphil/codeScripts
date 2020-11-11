const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = '../OAuth_Token.json';

fs.readFile('../credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), getArrayNSendMail);
});

let emailIDsFiltered = [];
let chunkSize = 5;
let startIndex = 0;
let endIndex = 0;

function getArrayNSendMail(auth) {
  let emailIDsContent = fs.readFileSync('../emailIDs.csv', 'utf-8');
  let emailRows = emailIDsContent.split('\n');
  
  let emailIDs = emailRows.map(function (row){
    let cells = row.split(',');
    return cells[3];
  });

  emailIDsFiltered = emailIDs.filter(function (val){
    if (val != '') return val;
  });

  emailIDsFiltered.shift();
  // console.log(emailIDsFiltered);

  sendMail(auth);
}

function sendMail(auth){
  let attachment1Base64 = fs.readFileSync('../INCA.pdf', {encoding: 'base64'});
  let attachment2Base64 = fs.readFileSync('../DATES.pdf', {encoding: 'base64'});
  // console.log(attachmentBase64);
  
  endIndex += chunkSize;
  let emailIDTempArry = emailIDsFiltered.slice(startIndex, endIndex);
  // console.log(emailIDTempArry);
  startIndex += chunkSize;

  let emailIDsStr = "'";
  for (let i = 0; i < emailIDTempArry.length; i++){
    emailIDsStr += emailIDTempArry[i] + ",";
  }

  emailIDsStr = emailIDsStr.replace(/,\s*$/, "");
  emailIDsStr += "'";
  console.log(emailIDsStr);

  let htmlContent = `
    <b>Please do not reply to this mail.</b> <br/><br/>
    Dear Students / Teachers / Principals, <br/><br/>

    The Guidelines for the 'INCA - NATIONAL MAP QUIZ - Online 2020 is attached. <br/><br/>
    The Tentative Dates for Online INCA-NATIONAL MAP QUIZ 2020 is also attached. <br/><br/>
    To know the exact date of online quiz, Kindly register at "http://quiz.incaindia.org". <br/><br/>
    Visit "http://www.incaindia.org". Goto Quiz > Online INCA Map Quiz 2020. <br/><br/>

    It is for students all over India free of charge. <br/><br/>

    For any query, kindly mail to "secretarygeneralinca935@gmail.com" <br/><br/>

    <strong>'INCA - NATIONAL MAP QUIZ'</strong> is being organized at the National level for the last Twenty Eight years and the participation of schools/students in this activity is highly appreciable. As as result, this programme has become one of the major activities of our association. The untiring efforts, being put forth and the overwhelming enthusism displayed by the students and teaching community is commendable, for making this event a great success. Thank You.

    <br/><br/>
    Regards,<br/>
    INCA Team,<br/>
    Survey of India,<br/>
    Govt. of India.<br/><br/>

    <b>Please do not reply to this mail.</b>
  `;

  let mail = new MailComposer({
    // to: emailIDsStr,
    to: 'rukmangadanies@gmail.com',
    html: htmlContent,
    subject: "Survey of India - INDIAN NATIONAL CARTOGRAPHIC ASSOCIATION - ONLINE MAP QUIZ 2020",
    textEncoding: "base64",
    attachments: [
      {   // encoded string as an attachment
        filename: 'INCA2020_Guidelines_OnlineTest.pdf',
        content: attachment1Base64,
        encoding: 'base64'
      },
      {   // encoded string as an attachment
        filename: 'Tentative Dates - INCA 2020.pdf',
        content: attachment2Base64,
        encoding: 'base64'
      }
    ]
    });

    mail.compile().build( (error, msg) => {
      if (error) return console.log('Error compiling email ' + error);
    
      const encodedMessage = Buffer.from(msg)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    
      const gmail = google.gmail({version: 'v1', auth});

      gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }

      }, function(err, response) {
        // console.log(err, response);
        if(!err){
          console.log("Message Sent");
          
          if(endIndex < emailIDsFiltered.length) sendMail(auth);
        } else {
          console.log(err);
        }
      });
    });
}

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

