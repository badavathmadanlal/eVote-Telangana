import envConfig from '../config/env.js';
import ApiError from './ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { isDemoMobile } from '../constants/demoAccounts.js';

class SmsProvider {
  /**
   * Clean and normalize 10-digit mobile number
   * @param {string} mobile 
   * @returns {string} 10-digit mobile number
   */
  sanitizeMobileNumber(mobile) {
    if (!mobile) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Mobile number is required for SMS delivery');
    }

    // Strip all non-digit characters
    let digits = String(mobile).replace(/\D/g, '');

    // Handle country code +91 or 0 prefix
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    // Validate standard 10-digit length
    if (!/^\d{10}$/.test(digits)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid mobile number: ${mobile}. Must be a 10-digit number.`);
    }

    return digits;
  }

  /**
   * Check if Fast2SMS Smart OTP is fully configured with API key and OTP ID
   */
  isSmartOtpConfigured() {
    return Boolean(envConfig.FAST2SMS_API_KEY && envConfig.FAST2SMS_OTP_ID);
  }

  /**
   * Extract 6-digit OTP from message string if not explicitly passed
   */
  extractOtpCode(message, options = {}) {
    if (options.otpCode) return String(options.otpCode);
    const match = String(message).match(/\b(\d{6})\b/);
    return match ? match[1] : '';
  }

  /**
   * Send OTP via Fast2SMS Smart OTP API
   * POST https://www.fast2sms.com/dev/otp/send
   */
  async sendSmartOtp(mobileNumber) {
    const cleanNumber = this.sanitizeMobileNumber(mobileNumber);

    // Bypass real SMS delivery for academic demo accounts
    if (isDemoMobile(cleanNumber)) {
      return {
        success: true,
        provider: 'academic_demo_mode',
        requestId: `DEMO_${cleanNumber}`
      };
    }

    const { FAST2SMS_API_KEY, FAST2SMS_OTP_ID } = envConfig;

    if (!FAST2SMS_API_KEY) {
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, 'FAST2SMS_API_KEY is not configured in server/.env');
    }

    if (!FAST2SMS_OTP_ID) {
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, 'FAST2SMS_OTP_ID is not configured in server/.env. Please configure an OTP ID in Fast2SMS Smart OTP dashboard.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://www.fast2sms.com/dev/otp/send', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          otp_id: FAST2SMS_OTP_ID,
          mobile: cleanNumber
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.return === false) {
        const errorDetail = Array.isArray(data.message) 
          ? data.message.join(', ') 
          : (data.message || `HTTP Status ${response.status}: ${response.statusText}`);
        throw new Error(errorDetail);
      }

      return {
        success: true,
        provider: 'fast2sms_smart_otp',
        requestId: data.request_id || data.status_code || 'OK'
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiError(HTTP_STATUS.GATEWAY_TIMEOUT, 'Fast2SMS Smart OTP gateway connection timed out after 10 seconds');
      }
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, `Fast2SMS Smart OTP Error: ${err.message}`);
    }
  }

  /**
   * Verify OTP via Fast2SMS Smart OTP API
   * POST https://www.fast2sms.com/dev/otp/verify
   */
  async verifySmartOtp(mobileNumber, otpCode) {
    const cleanNumber = this.sanitizeMobileNumber(mobileNumber);

    // Bypass real SMS verification for academic demo accounts (must match 123456)
    if (isDemoMobile(cleanNumber)) {
      if (String(otpCode).trim() === '123456') {
        return { success: true, provider: 'academic_demo_mode' };
      }
      return { success: false, message: 'Invalid Demo OTP. Use 123456 for academic demonstration accounts.' };
    }

    const { FAST2SMS_API_KEY, FAST2SMS_OTP_ID } = envConfig;

    if (!FAST2SMS_API_KEY || !FAST2SMS_OTP_ID) {
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, 'Fast2SMS Smart OTP credentials are not fully configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://www.fast2sms.com/dev/otp/verify', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          otp_id: FAST2SMS_OTP_ID,
          mobile: cleanNumber,
          otp: String(otpCode).trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.return === true || data.status_code === 200 || data.message === 'OTP verified successfully')) {
        return {
          success: true,
          provider: 'fast2sms_smart_otp'
        };
      }

      return {
        success: false,
        message: data.message || 'Invalid or expired OTP'
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiError(HTTP_STATUS.GATEWAY_TIMEOUT, 'Fast2SMS OTP verification timed out');
      }
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, `Fast2SMS Smart OTP Verification Error: ${err.message}`);
    }
  }

  /**
   * General SMS Dispatch Method
   */
  async sendSms(mobileNumber, message, options = {}) {
    const cleanNumber = this.sanitizeMobileNumber(mobileNumber);
    const otpCode = this.extractOtpCode(message, options);

    if (isDemoMobile(cleanNumber)) {
      return { success: true, provider: 'academic_demo_mode', messageId: `DEMO_${cleanNumber}` };
    }

    // 1. If Smart OTP is configured and this is an OTP request
    if (this.isSmartOtpConfigured() && (options.purpose === 'LOGIN_OTP' || options.purpose === 'RESET_PASSWORD' || otpCode)) {
      return await this.sendSmartOtp(cleanNumber);
    }

    // 2. In Production: missing SMS provider credentials is a critical error
    if (envConfig.NODE_ENV === 'production') {
      console.error('[SMS GATEWAY CRITICAL] Production SMS credentials are missing in server environment variables.');
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'SMS Gateway is not configured on this server. Contact system administrator.');
    }

    // 3. In Development ONLY (when credentials are not yet set in .env): informative console fallback
    console.warn(`\n=============================================================================`);
    console.warn(`[SMS GATEWAY NOTICE - DEVELOPMENT MODE]`);
    console.warn(`To deliver real SMS to mobile phones, set FAST2SMS_API_KEY & FAST2SMS_OTP_ID in server/.env`);
    console.warn(`Recipient Mobile: ${cleanNumber}`);
    console.warn(`OTP Dispatched : ${otpCode || 'N/A'}`);
    console.warn(`Full Message   : ${message}`);
    console.warn(`=============================================================================\n`);

    return {
      success: true,
      provider: 'development_fallback',
      messageId: `DEV_MOCK_${Date.now()}`
    };
  }
}

export default new SmsProvider();
