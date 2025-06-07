const nodemailer = require('nodemailer');

class GmailProvider {
  constructor(name, config) {
    this.name = name;
    this.failureCount = 0;
    this.circuitOpenUntil = null;
    this.transporter = nodemailer.createTransport(config);
  }

  isAvailable() {
    return !this.circuitOpenUntil || Date.now() > this.circuitOpenUntil;
  }

  markFailure() {
    this.failureCount++;
    if (this.failureCount >= 3) {
      this.circuitOpenUntil = Date.now() + 10000;
    }
  }

  markSuccess() {
    this.failureCount = 0;
    this.circuitOpenUntil = null;
  }

  async send(email, subject, body) {
    const mail = {
      from: '"Pearl Thoughts" <left2serve.cc@gmail.com>',
      to: email,
      subject,
      text: body
    };
    const info = await this.transporter.sendMail(mail);
    return `Sent to ${email} (id: ${info.messageId}) by ${this.name}`;
  }
}

module.exports = GmailProvider;
