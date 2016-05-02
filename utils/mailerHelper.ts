let nodemailer = require('nodemailer');
let transport = require('nodemailer-smtp-transport');

export let transporter = nodemailer.createTransport(transport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
}));
