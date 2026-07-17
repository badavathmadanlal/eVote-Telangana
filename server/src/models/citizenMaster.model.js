import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const citizenMasterSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    voterId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    aadhaarHash: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    constituency: {
      type: String,
      required: true,
      trim: true,
    },
    pollingStation: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically hash Aadhaar before saving

citizenMasterSchema.pre('save', async function () {
  if (!this.isModified('aadhaarHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.aadhaarHash = await bcrypt.hash(this.aadhaarHash, salt);
});

const CitizenMaster = mongoose.model('CitizenMaster', citizenMasterSchema);

export default CitizenMaster;
