import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    partyName: {
      type: String,
      required: true,
      trim: true,
    },
    partySymbol: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    manifesto: {
      type: String,
      trim: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Optional: compound index to prevent duplicate candidates quickly at the DB level,
// though the business logic in the service will also check this.
candidateSchema.index({ fullName: 1, electionId: 1 }, { unique: true });

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
