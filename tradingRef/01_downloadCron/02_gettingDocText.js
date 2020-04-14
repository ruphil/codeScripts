const fs = require('fs');
const {google} = require('googleapis');
const privatekey = require('../../token.json');

var jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/drive']
);

var docID = "1OXRIbBGhzuT4_j37i5qeIqFo78RSCRbSf7tohzgphWM";

var resource = {
    auth: jwtClient,
    documentId: docID
}

google.docs('v1').documents.get(resource, function (err, resp){
    // console.log(err);
    var contentArray = resp.data.body.content;
    var endIndex = contentArray[contentArray.length - 1].endIndex;
    console.log(resp.data.title, endIndex);
    console.log("The Index that can be used for inserting text in the end is (endIndex - 1):", endIndex-1);
})