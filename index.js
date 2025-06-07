require('dotenv').config();
const xlsx = require('xlsx');
const path = require('path');
const express = require('express');
const EmailService = require('./email/EmailService');
const GmailProvider = require('./email/providers/GmailProvider');
const MockFailProvider = require('./email/providers/MockFailProvider');

const app = express();
app.use(express.json()); // parse JSON request bodies

// Optional: Load emails from emails.xlsx (not used in API, but can be used separately)
const workbook = xlsx.readFile(path.join(__dirname, 'emails.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
const emails = data.map(row => row.Email).filter(e => typeof e === 'string' && e.includes('@'));

const gmailProvider = new GmailProvider('GmailProvider', {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mockProvider = new MockFailProvider('MockFailProvider');

const emailService = new EmailService([gmailProvider, mockProvider]);

// Serve frontend static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// POST /send-email endpoint for sending email via API
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ message: 'Missing required fields: to, subject, body' });
    }

    await emailService.sendEmail('api-request', to, subject, body);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});