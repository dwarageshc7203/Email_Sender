require('dotenv').config();
const xlsx = require('xlsx');
const path = require('path');
const EmailService = require('./email/EmailService');
const GmailProvider = require('./email/providers/GmailProvider');
const MockFailProvider = require('./email/providers/MockFailProvider');

const workbook = xlsx.readFile(path.join(__dirname, 'emails.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
const emails = data.map(row => row.Email).filter(e => typeof e === 'string' && e.includes('@'));

const gmailProvider = new GmailProvider('GmailProvider', {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const mockProvider = new MockFailProvider('MockFailProvider');

const emailService = new EmailService([gmailProvider, mockProvider]);

(async () => {
  const promises = emails.map((email, idx) => {
    return emailService.sendEmail(
      `email-${idx}`,
      email,
      'Pearl Thoughts Test',
      'Hello, this is a test message for resilient email sending service.'
    );
  });

  await Promise.all(promises);
  console.log('All emails processed');
})();
