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

var requests = [{
    insertText: {
      location: {
        index: 1
      },
      // endOfSegmentLocation: {
      //   segmentId: ""
      // },
      text: "hey"
    }
}];

var resource = {
    auth: jwtClient,
    documentId: docID,
    resource: {
        requests
    }
}

google.docs('v1').documents.batchUpdate(resource, function (_, _){});