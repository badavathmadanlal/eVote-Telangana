import nodemailer from 'nodemailer';
import envConfig from '../config/env.js';
import logger from './logger.js';

class EmailService {
  constructor() {
    // Transporter configuration (e.g. SMTP / Ethereal / Gmail / Mailgun)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    try {
      if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_HOST) {
        logger.info(`[EMAIL SERVICE MOCK] To: ${to} | Subject: ${subject}`);
        return { success: true, mock: true };
      }

      const mailOptions = {
        from: '"eVote Telangana Commission" <no-reply@evote.telangana.gov.in>',
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      // Fallback in dev/testing mode to not crash flow
      return { success: false, error: error.message };
    }
  }

  getRegistrationEmailTemplate(firstName, otp) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; color: #f59e0b;">eVote Telangana</h2>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">State Election Commission Portal</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #334155;">
          <h3 style="color: #0f172a;">Verify Your Account Registration</h3>
          <p>Dear ${firstName},</p>
          <p>Thank you for registering on the official eVote Telangana Remote Voting Portal. Please use the One-Time Password (OTP) below to complete your registration verification:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #64748b;">This OTP is valid for 5 minutes. Do not share this OTP with anyone.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8; border-t: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} State Election Commission, Government of Telangana.
        </div>
      </div>
    `;
  }

  getResetPasswordTemplate(firstName, otp) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; color: #f59e0b;">eVote Telangana</h2>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">State Election Commission Portal</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #334155;">
          <h3 style="color: #0f172a;">Password Reset One-Time Password (OTP)</h3>
          <p>Dear ${firstName || 'Voter'},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed with creating a new password:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #b91c1c; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #64748b;">This OTP is valid for 5 minutes. If you did not request this, please secure your account immediately.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8; border-t: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} State Election Commission, Government of Telangana.
        </div>
      </div>
    `;
  }

  getSuccessPasswordResetTemplate(firstName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; color: #f59e0b;">eVote Telangana</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #334155;">
          <h3 style="color: #15803d;">Password Changed Successfully</h3>
          <p>Dear ${firstName || 'Voter'},</p>
          <p>Your password for your eVote Telangana portal account was updated successfully.</p>
          <p>If you did not perform this change, please contact the Chief Electoral Office immediately.</p>
        </div>
      </div>
    `;
  }
}

export default new EmailService();
