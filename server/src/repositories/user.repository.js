import User from '../models/user.model.js';

class UserRepository {
  /**
   * Find a user by their email address
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  /**
   * Create a new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const user = await User.create(userData);
    // Remove password from returned object
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Find a user by ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async findById(id) {
    return User.findById(id);
  }
}

export default new UserRepository();
