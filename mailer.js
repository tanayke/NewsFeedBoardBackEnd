const { body } = require('express-validator');

const nodeMailer = require('nodemailer');
const SMTPTransport = require('nodemailer/lib/smtp-transport');
const { email } = require('./config/config');

// eslint-disable-next-line no-shadow
const sendEmail = (toEmailId, subject, body, callback) => {
  const transport = nodeMailer.createTransport(
    new SMTPTransport({
      service: 'SendPulse',
      auth: {
        user: email.id,
        pass: email.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 5000000,
      greetingTimeout: 5000000,
      socketTimeout: 5000000,
    })
  );

  const options = {
    from: email.id,
    to: toEmailId,
    // eslint-disable-next-line object-shorthand
    subject: subject,
    html: body,
  };

  console.log(options);
  console.log('emailUser and pass from env', email.id, email.password);

  transport.sendMail(options, callback);
};

module.exports = {
  sendEmail,
};
