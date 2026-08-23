import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'],
    },
    aadhaar: {
      type: String,
      sparse: true,
      trim: true,
    },
    epicNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    state: {
      type: String,
      default: 'Telangana',
      trim: true,
    },
    district: {
      type: String,
      default: 'Hyderabad',
      trim: true,
    },
    mandal: {
      type: String,
      default: 'Musheerabad',
      trim: true,
    },
    village: {
      type: String,
      default: 'Musheerabad',
      trim: true,
    },
    constituency: {
      type: String,
      default: '057-Musheerabad',
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['voter', 'admin', 'officer'],
      default: 'voter',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    isKycVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    isDemoAccount: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
