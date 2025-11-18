import mongoose from 'mongoose';

const healthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'mental-health', 'sleep', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const HealthTip = mongoose.model('HealthTip', healthTipSchema);

export default HealthTip;
