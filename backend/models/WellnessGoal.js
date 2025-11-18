import mongoose from 'mongoose';

const wellnessGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    enum: ['steps', 'water', 'sleep', 'active_time', 'exercise', 'custom'],
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true // e.g., 'steps', 'glasses', 'hours', 'minutes', 'mins'
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Current progress
  currentValue: {
    type: Number,
    default: 0
  },
  // For sleep goals
  sleepStartTime: {
    type: String // e.g., "11:30 pm"
  },
  sleepEndTime: {
    type: String // e.g., "06:00 am"
  }
}, {
  timestamps: true
});

const WellnessGoal = mongoose.model('WellnessGoal', wellnessGoalSchema);

export default WellnessGoal;
