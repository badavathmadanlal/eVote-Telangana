import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import jwtUtils from '../utils/jwt.js';

class AuthController {
  /**
   * @desc    Register user
   * @route   POST /api/v1/auth/register
   * @access  Public
   */
  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    const { user, token } = await authService.register({
      firstName,
      lastName,
      email,
      password,
    });

    // Set JWT as HTTP-only cookie
    jwtUtils.setTokenCookie(res, token);

    return ApiResponse.created(res, 'User registered successfully', {
      user,
      token, // Also return in body for client-side storage if preferred
    });
  }

  /**
   * @desc    Login user
   * @route   POST /api/v1/auth/login
   * @access  Public
   */
  async login(req, res) {
    const { email, password } = req.body;

    const { user, token } = await authService.login({
      email,
      password,
    });

    // Set JWT as HTTP-only cookie
    jwtUtils.setTokenCookie(res, token);

    return ApiResponse.success(res, 'User logged in successfully', {
      user,
      token, // Also return in body for client-side storage if preferred
    });
  }
}

export default new AuthController();
