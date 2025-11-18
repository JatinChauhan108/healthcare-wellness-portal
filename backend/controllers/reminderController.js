import PreventiveCareReminder from '../models/PreventiveCareReminder.js';
import { createAuditLog } from '../middleware/auditLog.js';

// @desc    Get all reminders for current user
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const { isCompleted, upcoming } = req.query;
    
    const filter = { userId: req.userId };
    
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true';
    }

    if (upcoming === 'true') {
      filter.dueDate = { $gte: new Date() };
      filter.isCompleted = false;
    }

    const reminders = await PreventiveCareReminder.find(filter)
      .populate('createdBy', 'firstName lastName role')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: { reminders }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
  try {
    const { title, description, dueDate, reminderType, userId } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and due date are required' 
      });
    }

    // If provider is creating for patient, use userId from body
    // Otherwise, create for self
    const targetUserId = req.user.role === 'provider' && userId 
      ? userId 
      : req.userId;

    const reminder = new PreventiveCareReminder({
      userId: targetUserId,
      title,
      description,
      dueDate,
      reminderType,
      createdBy: req.userId
    });

    await reminder.save();

    // Audit log
    await createAuditLog(req.userId, 'reminder_created', {
      targetResource: 'PreventiveCareReminder',
      targetId: reminder._id
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: { reminder }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reminder = await PreventiveCareReminder.findOne({ 
      _id: id, 
      userId: req.userId 
    });

    if (!reminder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    Object.assign(reminder, updates);
    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: { reminder }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark reminder as completed
// @route   PUT /api/reminders/:id/complete
// @access  Private
export const completeReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reminder = await PreventiveCareReminder.findOne({ 
      _id: id, 
      userId: req.userId 
    });

    if (!reminder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    reminder.isCompleted = true;
    reminder.completedDate = new Date();
    await reminder.save();

    // Audit log
    await createAuditLog(req.userId, 'reminder_completed', {
      targetResource: 'PreventiveCareReminder',
      targetId: reminder._id
    });

    res.json({
      success: true,
      message: 'Reminder marked as completed',
      data: { reminder }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reminder = await PreventiveCareReminder.findOneAndDelete({ 
      _id: id, 
      userId: req.userId 
    });

    if (!reminder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
