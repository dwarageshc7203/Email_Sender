class MockFailProvider {
  constructor(name) {
    this.name = name;
    this.failureCount = 0;
    this.circuitOpenUntil = null;
  }

  isAvailable() {
    return !this.circuitOpenUntil || Date.now() > this.circuitOpenUntil;
  }

  markFailure() {
    this.failureCount++;
    if (this.failureCount >= 2) {
      this.circuitOpenUntil = Date.now() + 8000;
    }
  }

  markSuccess() {
    this.failureCount = 0;
    this.circuitOpenUntil = null;
  }

  async send(email, subject, body) {
    if (Math.random() < 0.5) {
      throw new Error(`${this.name} random failure`);
    }
    return `Mock sent to ${email} by ${this.name}`;
  }
}

module.exports = MockFailProvider;
