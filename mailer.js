const { body } = require('express-validator');

const nodeMailer = require('nodemailer');
const SMTPTransport = require('nodemailer/lib/smtp-transport');
const { email } = require('./config/config');

// eslint-disable-next-line no-shadow
const sendEmail = (emailId, subject, body, callback) => {
  const transport = nodeMailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '2faab10a6cddb8',
      pass: 'a6daf6170b7476',
    },
  });

  const options = {
    from: 'siddharthmane-4eb91e@inbox.mailtrap.io',
    to: emailId,
    // eslint-disable-next-line object-shorthand
    subject: subject,
    html: body,
  };

  console.log(options);
  //console.log('emailUser and pass from env', email.id);

  transport.sendMail(options, callback);
};

module.exports = {
  sendEmail,
};
