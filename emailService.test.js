const assert = require('assert');
const EmailService = require('../email/EmailService');
const MockFailProvider = require('../email/providers/MockFailProvider');

const emailService = new EmailService([
  new MockFailProvider('Mock1'),
  new MockFailProvider('Mock2')
], 2, 10, 5000);

(async () => {
  await emailService.sendEmail('1', 'cnls2official@gmail.com', 'Test', 'Body');
  await emailService.sendEmail('1', 'test@example.com', 'Test', 'Body');
  assert.strictEqual(emailService.getStatus('1'), 'SENT');

  await emailService.sendEmail('2', 'fail@example.com', 'Test2', 'Body2');
  const status = emailService.getStatus('2');
  assert(status === 'SENT' || status === 'FAILED');

  console.log('All tests passed');
})();