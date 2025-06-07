Features

- Retry with exponential backoff
- Fallback to second provider
- Rate limiting
- Idempotency to prevent duplicate sends
- Circuit breaker for failing providers
- Queue-based processing
- Simple logging to `log.txt`

Setup

1. Clone the repo
2. Run `npm install`
3. Create `.env` with Gmail credentials:

GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_password_or_app_password

4. Add `emails.xlsx` with one column `Email`
5. Run with `node index.js`
6. Run tests with `node test/emailService.test.js`

Mock Providers

-GmailProvider: Uses Nodemailer to send real email
-MockFailProvider: Simulates 50% random failure

Assumptions

-Uses `nodemailer` only
-No DB is used, uses in-memory tracking
-Logging is plain file logging

Notes

This service is not a deployed API. It runs as a script. A simple Express endpoint can be added if needed.