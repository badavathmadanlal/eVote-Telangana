import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Citizen',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: true,
    },
    constituency: {
      type: String,
      required: true,
      trim: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate voting at the DB level
voteSchema.index({ citizenId: 1, electionId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
