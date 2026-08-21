import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Registration', 'Login', 'Verification', 'Voting', 'Election', 'Candidates', 'Security', 'Technical', 'General'],
      default: 'General',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
faqSchema.index({ question: 'text', answer: 'text' });

const Faq = mongoose.model('Faq', faqSchema);

export default Faq;
