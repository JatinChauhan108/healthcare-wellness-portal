import ProviderPatientAssignment from '../models/ProviderPatientAssignment.js';
import User from '../models/User.js';
import WellnessGoal from '../models/WellnessGoal.js';
import GoalLog from '../models/GoalLog.js';
import PreventiveCareReminder from '../models/PreventiveCareReminder.js';
import { createAuditLog } from '../middleware/auditLog.js';

// @desc    Get all assigned patients for provider
// @route   GET /api/provider/patients
// @access  Private (Provider only)
export const getAssignedPatients = async (req, res, next) => {
  try {
    const assignments = await ProviderPatientAssignment.find({ 
      providerId: req.userId,
      isActive: true 
    }).populate('patientId', '-password');

    const patientsWithCompliance = await Promise.all(
      assignments.map(async (assignment) => {
        const patient = assignment.patientId;
        
        // Get patient's goals
        const goals = await WellnessGoal.find({ 
          userId: patient._id, 
          isActive: true 
        });

        // Get recent logs (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentLogs = await GoalLog.find({
          userId: patient._id,
          date: { $gte: sevenDaysAgo }
        });

        // Get upcoming reminders
        const upcomingReminders = await PreventiveCareReminder.find({
          userId: patient._id,
          isCompleted: false,
          dueDate: { $gte: new Date() }
        });

        // Get missed checkups (past due and not completed)
        const missedCheckups = await PreventiveCareReminder.find({
          userId: patient._id,
          isCompleted: false,
          dueDate: { $lt: new Date() }
        });

        // Calculate compliance (percentage of days with logged goals)
        const daysWithLogs = new Set(
          recentLogs.map(log => log.date.toDateString())
        ).size;
        const compliancePercentage = goals.length > 0 
          ? Math.round((daysWithLogs / 7) * 100) 
          : 0;

        // Determine compliance status
        let complianceStatus = 'Goal Met';
        if (compliancePercentage < 50) {
          complianceStatus = 'Needs Attention';
        } else if (compliancePercentage < 80) {
          complianceStatus = 'Missed Preventive Checkup';
        }

        return {
          patientId: patient._id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          assignedDate: assignment.assignedDate,
          complianceStatus,
          compliancePercentage,
          activeGoals: goals.length,
          logsLastWeek: recentLogs.length,
          upcomingReminders: upcomingReminders.length,
          missedCheckups: missedCheckups.length
        };
      })
    );

    res.json({
      success: true,
      data: { 
        patients: patientsWithCompliance,
        totalPatients: patientsWithCompliance.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient details and compliance
// @route   GET /api/provider/patients/:patientId
// @access  Private (Provider only)
export const getPatientDetails = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Verify assignment
    const assignment = await ProviderPatientAssignment.findOne({
      providerId: req.userId,
      patientId,
      isActive: true
    });

    if (!assignment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found or not assigned to you' 
      });
    }

    const patient = await User.findById(patientId).select('-password');
    const goals = await WellnessGoal.find({ userId: patientId });
    
    // Get logs for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await GoalLog.find({
      userId: patientId,
      date: { $gte: thirtyDaysAgo }
    }).populate('goalId').sort({ date: -1 });

    const reminders = await PreventiveCareReminder.find({
      userId: patientId
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: {
        patient,
        goals,
        logs,
        reminders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign patient to provider
// @route   POST /api/provider/patients
// @access  Private (Provider only)
export const assignPatient = async (req, res, next) => {
  try {
    const { patientId, notes } = req.body;

    if (!patientId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient ID is required' 
      });
    }

    // Verify patient exists and is a patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    // Check if already assigned
    const existingAssignment = await ProviderPatientAssignment.findOne({
      providerId: req.userId,
      patientId
    });

    if (existingAssignment) {
      if (existingAssignment.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: 'Patient already assigned' 
        });
      } else {
        // Reactivate assignment
        existingAssignment.isActive = true;
        existingAssignment.notes = notes || existingAssignment.notes;
        await existingAssignment.save();

        return res.json({
          success: true,
          message: 'Patient assignment reactivated',
          data: { assignment: existingAssignment }
        });
      }
    }

    // Create new assignment
    const assignment = new ProviderPatientAssignment({
      providerId: req.userId,
      patientId,
      notes
    });

    await assignment.save();

    // Audit log
    await createAuditLog(req.userId, 'patient_assigned', {
      targetResource: 'ProviderPatientAssignment',
      targetId: assignment._id,
      details: { patientId }
    });

    res.status(201).json({
      success: true,
      message: 'Patient assigned successfully',
      data: { assignment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unassign patient from provider
// @route   DELETE /api/provider/patients/:patientId
// @access  Private (Provider only)
export const unassignPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const assignment = await ProviderPatientAssignment.findOne({
      providerId: req.userId,
      patientId
    });

    if (!assignment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }

    assignment.isActive = false;
    await assignment.save();

    res.json({
      success: true,
      message: 'Patient unassigned successfully'
    });
  } catch (error) {
    next(error);
  }
};
