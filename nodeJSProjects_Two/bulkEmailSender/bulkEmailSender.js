const { google } = require('googleapis');
const privatekey = require('../../token.json');
const fs = require('fs');

let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/gmail.send'],
  'rukmangadanies@gmail.com'
);

const subject = '🤘 Hello 🤘';
const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
const messageParts = [
    'From: Justin Beckwith <rukmangadanies@gmail.com>',
    'To: Justin Beckwith <rukmangadanies@google.com>',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    'This is a message just to say hello.',
    'So... <b>Hello!</b>  🤘❤️😎',
];
const message = messageParts.join('\n');

// The body needs to be base64url encoded.
const encodedMessage = Buffer.from(message)
                        .toString('base64')
                        .replace(/\+/g, '-')
                        .replace(/\//g, '_')
                        .replace(/=+$/, '');

google.gmail('v1').users.messages.send({
    auth: jwtClient,
    userId: 'rukmangadanies@gmail.com',
    requestBody: {
        raw: encodedMessage
    }

}, function(err, response) {
    console.log(err, response);
});