import mongoose from 'mongoose';

const goalLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WellnessGoal',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  actualValue: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  // Additional metrics for specific goal types
  calories: {
    type: Number // For active time
  },
  distance: {
    type: Number // For steps/active time (in km)
  },
  sleepStartTime: {
    type: String // e.g., "11:30 pm"
  },
  sleepEndTime: {
    type: String // e.g., "06:00 am"
  },
  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent']
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate logs for same goal on same day
goalLogSchema.index({ userId: 1, goalId: 1, date: 1 }, { unique: true });

const GoalLog = mongoose.model('GoalLog', goalLogSchema);

export default GoalLog;
