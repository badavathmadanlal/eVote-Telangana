import assistantService from '../services/assistant.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const BLOCKED_PATTERNS = [
  /password\s*[:=]\s*\S+/i,
  /aadhaar\s*[:=]\s*\d+/i,
  /jwt\s*[:=]\s*\S+/i,
  /bearer\s+\S+/i,
  /authorization\s*[:=]/i,
  /mongodb\+srv/i,
  /process\.env/i,
];

class AssistantController {
  async chat(req, res) {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return ApiResponse.success(res, 'Assistant response', {
        reply: 'Namaste! I am the eVote AI Assistant. How can I help you today?',
        source: 'Knowledge Base',
      });
    }

    const trimmed = message.trim();

    // Enforce message length limit
    if (trimmed.length > 1000) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Message is too long. Please keep questions under 1000 characters.');
    }

    // Block attempts to extract sensitive data through AI
    const isBlocked = BLOCKED_PATTERNS.some(p => p.test(trimmed));
    if (isBlocked) {
      return ApiResponse.success(res, 'Assistant response', {
        reply: 'I cannot process messages that appear to contain sensitive credentials or tokens. Please ask a general question about the portal or election topics.',
        source: 'Security Filter',
      });
    }

    const response = await assistantService.processWithProvider(trimmed, 'internal');
    return ApiResponse.success(res, 'Assistant response retrieved', response);
  }
}

export default new AssistantController();
