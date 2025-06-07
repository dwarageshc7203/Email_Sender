require('dotenv').config();
const express = require('express');
const path = require('path');

const EmailService = require('./email/EmailService');
const GmailProvider = require('./email/providers/GmailProvider');
const MockFailProvider = require('./email/providers/MockFailProvider');

const app = express();
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Initialize email service with providers
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

// API endpoint for sending email
app.post('/send', async (req, res) => {
  const { id, email, subject, body } = req.body;

  if (!id || !email || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await emailService.sendEmail(id, email, subject, body);
    const status = emailService.getStatus(id);
    res.json({ id, email, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email', detail: err.message });
  }
});

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
