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
   * Find a user by mobile number
   * @param {string} mobileNumber
   * @returns {Promise<Object>}
   */
  async findByMobileNumber(mobileNumber) {
    return User.findOne({ mobileNumber }).select('+password');
  }

  /**
   * Find a user by email or mobile
   * @param {string} identifier (email or mobile)
   * @returns {Promise<Object>}
   */
  async findByEmailOrMobile(identifier) {
    return User.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }]
    }).select('+password');
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
    return User.findById(id).select('+password');
  }

  /**
   * Update a user by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async update(id, updateData) {
    const user = await User.findById(id).select('+password');
    if (!user) return null;
    
    Object.assign(user, updateData);
    await user.save();
    return user;
  }

  /**
   * Find all users
   * @param {Object} query
   * @returns {Promise<Array>}
   */
  async findAll(query = {}) {
    return User.find(query).sort({ createdAt: -1 });
  }
}

export default new UserRepository();
