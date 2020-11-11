const nodemailer = require('nodemailer');
const credentials = require('../../govEmailCredentials.json');

let transporter = nodemailer.createTransport({
    host: 'smtp.mail.gov.in',
    port: 465,
    secure: true,
    auth: {
        user: credentials.username,
        pass: credentials.password
    }
});

let mailOptions = {
    // from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'rukmangadanies@gmail.com, rukmangadan.soi@gov.in',
    subject: 'Hello ✔',
    text: 'Hello world ?',
    html: '<b>Hello world ?</b>'
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});