import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwtUtils from '../utils/jwt.js';

class AuthController {
  async register(req, res) {
    const { firstName, lastName, email, mobileNumber, password } = req.body;

    const { user, token } = await authService.register({
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
    });

    jwtUtils.setTokenCookie(res, token);

    return ApiResponse.created(res, 'User registered successfully', { user, token });
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
    return ApiResponse.success(res, response.message);
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

  async getAllUsers(req, res) {
    const users = await authService.getAllUsers(req.query);
    return ApiResponse.success(res, 'Users retrieved successfully', { users });
  }
}

export default new AuthController();
