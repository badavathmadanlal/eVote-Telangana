import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwtUtils from '../utils/jwt.js';

class AuthController {
  async register(req, res) {
    const { firstName, lastName, email, mobileNumber, aadhaar, whatsappNumber, password } = req.body;

    const result = await authService.register({
      firstName,
      lastName,
      email,
      mobileNumber,
      aadhaar,
      whatsappNumber,
      password,
    });

    if (result.token) {
      jwtUtils.setTokenCookie(res, result.token);
    }

    return ApiResponse.created(res, result.message || 'User registered successfully', result);
  }

  async login(req, res) {
    const { emailOrMobile, password } = req.body;

    const { user, token } = await authService.login({ emailOrMobile, password });

    jwtUtils.setTokenCookie(res, token);

    return ApiResponse.success(res, 'User logged in successfully', { user, token });
  }

  async sendLoginOtp(req, res) {
    const { mobileNumber } = req.body;
    const response = await authService.sendLoginOtp(mobileNumber);
    return ApiResponse.success(res, response.message, response);
  }

  async verifyLoginOtp(req, res) {
    const { mobileNumber, otp } = req.body;
    const { user, token } = await authService.verifyLoginOtp(mobileNumber, otp);

    jwtUtils.setTokenCookie(res, token);

    return ApiResponse.success(res, 'OTP verified and logged in successfully', { user, token });
  }

  async forgotPassword(req, res) {
    const { identifier } = req.body;
    const response = await authService.forgotPassword(identifier);
    return ApiResponse.success(res, response.message);
  }

  async verifyResetOtp(req, res) {
    const { identifier, otp } = req.body;
    const response = await authService.verifyResetOtp(identifier, otp);
    return ApiResponse.success(res, response.message, { resetToken: response.resetToken });
  }

  async resetPassword(req, res) {
    const { resetToken, password } = req.body;
    const response = await authService.resetPassword(resetToken, password);
    return ApiResponse.success(res, response.message);
  }

  async getMe(req, res) {
    return ApiResponse.success(res, 'User profile fetched successfully', { user: req.user });
  }
}

export default new AuthController();
