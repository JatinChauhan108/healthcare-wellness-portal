import mongoose from 'mongoose';

const providerPatientAssignmentSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Ensure unique provider-patient relationships
providerPatientAssignmentSchema.index({ providerId: 1, patientId: 1 }, { unique: true });

const ProviderPatientAssignment = mongoose.model('ProviderPatientAssignment', providerPatientAssignmentSchema);

export default ProviderPatientAssignment;
