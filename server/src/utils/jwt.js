import jwt from 'jsonwebtoken';
import envConfig from '../config/env.js';

class JwtUtils {
  /**
   * Generate a JWT token for a given user ID
   * @param {string} userId
   * @returns {string} JWT Token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRE,
    });
  }

  /**
   * Set JWT token in an HTTP-only cookie
   * @param {Object} res - Express response object
   * @param {string} token - JWT Token
   */
  setTokenCookie(res, token) {
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('token', token, options);
  }
}

export default new JwtUtils();
