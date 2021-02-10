const nodemailer = require('nodemailer')
const credentials = require('../config/settings').EMAIL_CREDENTIALS

function sendMail(to, subject, html, attachments) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, //true for 465, false for other ports
    auth: {
      user: credentials.EMAIL,
      pass: credentials.PASSWORD,
    },
  })

  transporter
    .sendMail({
      from: `"Optica Tovar" <${credentials.EMAIL}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
      attachments,
    })
    .then((info) => console.log(info))
    .catch((err) => console.error(err))
}

module.exports = {
  sendMail,
}
