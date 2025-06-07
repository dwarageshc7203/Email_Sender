require('dotenv').config();
const express = require('express');
const EmailService = require('./email/EmailService');
const GmailProvider = require('./email/providers/GmailProvider');
const MockFailProvider = require('./email/providers/MockFailProvider');

const app = express();
app.use(express.json());

const emailService = new EmailService([
  new GmailProvider('Gmail', {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  }),
  new MockFailProvider('Mock')
]);

app.post('/send', async (req, res) => {
  const { id, email, subject, body } = req.body;

  if (!id || !email || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await emailService.sendEmail(id, email, subject, body);
  const status = emailService.getStatus(id);
  res.json({ id, email, status });
});

app.get('/', (_, res) => {
  res.send('Email API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
