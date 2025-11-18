import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'profile_view',
      'profile_update',
      'data_access',
      'goal_created',
      'goal_updated',
      'goal_logged',
      'reminder_created',
      'reminder_completed',
      'patient_assigned',
      'consent_given'
    ]
  },
  targetResource: {
    type: String // e.g., 'User', 'Goal', 'Reminder'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
