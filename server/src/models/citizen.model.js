import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    citizenMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CitizenMaster',
      required: true,
      unique: true,
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Citizen = mongoose.model('Citizen', citizenSchema);

export default Citizen;
