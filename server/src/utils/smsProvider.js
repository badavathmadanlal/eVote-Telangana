class SmsProvider {
  async sendSms(mobileNumber, message) {
    // Provider Abstraction Layer
    // In production: Integrate Twilio / Fast2SMS / MSG91 HTTP API here
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SMS PROVIDER MOCK] To: ${mobileNumber} | Message: ${message}`);
    }
    return { success: true, messageId: `MOCK_${Date.now()}` };
  }
}

export default new SmsProvider();
