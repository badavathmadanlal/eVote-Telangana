import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import jwtUtils from '../utils/jwt.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration details
   * @returns {Promise<Object>} The registered user and token
   */
  async register(userData) {
    // Check if user already exists
    const userExists = await userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }

    // Create the user
    const user = await userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: 'voter', // Default role
    });

    // Generate token
    const token = jwtUtils.generateToken(user._id);

    return { user, token };
  }

  /**
   * Login a user
   * @param {Object} credentials - User login details (email, password)
   * @returns {Promise<Object>} The authenticated user and token
   */
  async login({ email, password }) {
    // 1. Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    // 2. Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    // Remove password from returned object
    const userObject = user.toObject();
    delete userObject.password;

    // 3. Generate token
    const token = jwtUtils.generateToken(user._id);

    return { user: userObject, token };
  }
}

export default new AuthService();
