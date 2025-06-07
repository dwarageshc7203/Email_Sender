const fs = require('fs');
class EmailService {
  constructor(providers, maxRetries = 3, rateLimit = 5, rateInterval = 10000) {
    this.providers = providers;
    this.maxRetries = maxRetries;
    this.rateLimit = rateLimit;
    this.rateInterval = rateInterval;
    this.sentEmails = new Set();
    this.status = new Map();
    this.queue = [];
    this.sentTimestamps = [];
    this.processing = false;
    this.processingPromise = null;
  }

  sendEmail(id, email, subject, body) {
    if (this.sentEmails.has(id)) {
      this._log(`Skipped duplicate for ${email}`);
      return Promise.resolve();
    }

    this.queue.push({ id, email, subject, body });

    if (!this.processingPromise) {
      this.processingPromise = this._processQueue().then(() => {
        this.processingPromise = null;
      });
    }

    return this.processingPromise;
  }

  async _processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      if (!this._canSendMore()) {
        await this._wait(300);
        continue;
      }

      const { id, email, subject, body } = this.queue.shift();
      let sent = false;

      for (const provider of this.providers) {
        if (!provider.isAvailable()) continue;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
          try {
            const result = await provider.send(email, subject, body);
            provider.markSuccess();
            this._markSent(id, email);
            this._log(result);
            sent = true;
            break;
          } catch (err) {
            this._log(`Provider ${provider.name} failed on attempt ${attempt}: ${err.message}`);
            provider.markFailure();
            await this._wait(2 ** attempt * 200);
          }
        }

        if (sent) break;
      }

      if (!sent) {
        this.status.set(id, 'FAILED');
        this._log(`Email to ${email} failed after all attempts`);
      }

      this._recordRate();
    }

    this.processing = false;
  }

  _markSent(id, email) {
    this.sentEmails.add(id);
    this.status.set(id, 'SENT');
  }

  _recordRate() {
    const now = Date.now();
    this.sentTimestamps.push(now);
    this.sentTimestamps = this.sentTimestamps.filter(ts => now - ts <= this.rateInterval);
  }

  _canSendMore() {
    return this.sentTimestamps.length < this.rateLimit;
  }

  _wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  _log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync('log.txt', line + '\n');
  }

  getStatus(id) {
    return this.status.get(id) || 'PENDING';
  }
}

module.exports = EmailService;
