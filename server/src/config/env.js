import dotenv from 'dotenv';
dotenv.config();

const envConfig = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/remote_voting_system',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // SMS Gateway Configuration (Fast2SMS Smart OTP)
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'fast2sms',
  FAST2SMS_API_KEY: process.env.FAST2SMS_API_KEY || '',
  FAST2SMS_OTP_ID: process.env.FAST2SMS_OTP_ID || '',

  // Fallback Twilio / MSG91 Configuration
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || '',
  MSG91_SENDER_ID: process.env.MSG91_SENDER_ID || 'EVOTE',
  MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID || '',
});

export default envConfig;
