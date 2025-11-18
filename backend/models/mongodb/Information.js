import mongoose from 'mongoose';

const informationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['covid-19', 'seasonal-flu', 'mental-health', 'general'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: String,
      default: 'admin'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Information', informationSchema);
