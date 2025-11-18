import mongoose from 'mongoose';

const preventiveCareReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  reminderType: {
    type: String,
    enum: ['checkup', 'vaccination', 'screening', 'dental', 'other'],
    default: 'other'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Can be created by provider or patient
  }
}, {
  timestamps: true
});

const PreventiveCareReminder = mongoose.model('PreventiveCareReminder', preventiveCareReminderSchema);

export default PreventiveCareReminder;
