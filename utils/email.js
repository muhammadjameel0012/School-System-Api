/**
 * Email utility – sending disabled for development (no SMTP creds).
 * No mail is sent and no simulation; methods are no-ops.
 * Use DEFAULT_OTP when implementing OTP flows in development.
 */

/** Default OTP for development when email sending is off. Use for local/testing only. */
const DEFAULT_OTP = '1234';

const EMAIL_DISABLED = true;

class Email {
  constructor(user, url) {
    this.to = user?.email || '';
    this.firstName = (user?.fullname || user?.name || 'User').split(' ')[0];
    this.url = url || '';
    this.from = 'School Management <noreply@school.local>';
  }

  async send(subject, message, html) {
    if (EMAIL_DISABLED) return;
    // No transporter, no send, no simulation
  }

  async sendWelcomeEmail() {
    if (EMAIL_DISABLED) return;
    // No-op
  }

  async sendPasswordResetEmail(html) {
    if (EMAIL_DISABLED) return;
    // No-op
  }
}

module.exports = Email;
module.exports.DEFAULT_OTP = DEFAULT_OTP;
