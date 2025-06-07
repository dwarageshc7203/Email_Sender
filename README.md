Email Sending Service

A resilient email-sending backend built using Node.js with support for retry, fallback, rate limiting, idempotency, status tracking, and circuit breaker mechanisms. Includes a simple frontend UI and unit tests.

Features

-Retry with exponential backoff
-Fallback to second provider
-Rate limiting
-Idempotency to prevent duplicate sends
-Circuit breaker for failing providers
-Queue-based processing
-Simple logging to log.txt

File Structure

email:
-EmailService.js
-Provider:
--GmailProvider.js
--MockFailProvider.js
-public:
--index.html
-test:
--emailService.test.js
-.env
-index.js
-log.txt
-package-lock.json
-package.json
-README.md
-server.js

[Note: Names ending with ':' are folders. The rest all are files]


Setup

1. Clone the repo
2. Run npm install
3. Create .env file with Gmail credentials:

GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_password_or_app_password

4. Run with node index.js
5. Run tests with node test/emailService.test.js
6. Open: http://localhost:10000 in your browser

Mock Providers

-GmailProvider: Uses Nodemailer to send real email
-MockFailProvider: Simulates 50% random failure

Assumptions

-Uses nodemailer only
-No DB is used, uses input from the front end
-Logging is plain file logging

Notes

API Deployment Link: https://email-sender-4t37.onrender.com (Using Render)