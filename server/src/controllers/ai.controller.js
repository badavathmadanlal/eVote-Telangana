import aiAssistantService from '../services/aiAssistant.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

class AiController {
  /**
   * Authenticated Citizen AI Chat Handler
   * POST /api/v1/ai/chat
   */
  chat = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required to access the AI Election Assistant');
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide a non-empty message string');
    }

    if (message.length > 500) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Message exceeds maximum length of 500 characters');
    }

    const response = await aiAssistantService.processCitizenQuery(userId, message);

    return ApiResponse.success(res, 'AI response generated successfully', response);
  });
}

export default new AiController();
