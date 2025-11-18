import WellnessGoal from '../models/WellnessGoal.js';
import GoalLog from '../models/GoalLog.js';
import { createAuditLog } from '../middleware/auditLog.js';

// @desc    Get all wellness goals for current user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    const filter = { userId: req.userId };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const goals = await WellnessGoal.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { goals }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new wellness goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { goalType, targetValue, unit, description, endDate } = req.body;

    if (!goalType || !targetValue || !unit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Goal type, target value, and unit are required' 
      });
    }

    const goal = new WellnessGoal({
      userId: req.userId,
      goalType,
      targetValue,
      unit,
      description,
      endDate
    });

    await goal.save();

    // Audit log
    await createAuditLog(req.userId, 'goal_created', {
      targetResource: 'WellnessGoal',
      targetId: goal._id
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: { goal }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update wellness goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const goal = await WellnessGoal.findOne({ _id: id, userId: req.userId });

    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Goal not found' 
      });
    }

    Object.assign(goal, updates);
    await goal.save();

    // Audit log
    await createAuditLog(req.userId, 'goal_updated', {
      targetResource: 'WellnessGoal',
      targetId: goal._id
    });

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: { goal }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete wellness goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const goal = await WellnessGoal.findOneAndDelete({ 
      _id: id, 
      userId: req.userId 
    });

    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Goal not found' 
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log goal progress
// @route   POST /api/goals/:id/log
// @access  Private
export const logGoalProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { actualValue, date, notes, calories, distance, sleepStartTime, sleepEndTime, sleepQuality } = req.body;

    if (actualValue === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Actual value is required' 
      });
    }

    // Verify goal exists and belongs to user
    const goal = await WellnessGoal.findOne({ _id: id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Goal not found' 
      });
    }

    // Create or update log entry
    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const logData = {
      actualValue,
      notes
    };

    // Add optional fields based on goal type
    if (calories !== undefined) logData.calories = calories;
    if (distance !== undefined) logData.distance = distance;
    if (sleepStartTime) logData.sleepStartTime = sleepStartTime;
    if (sleepEndTime) logData.sleepEndTime = sleepEndTime;
    if (sleepQuality) logData.sleepQuality = sleepQuality;

    const log = await GoalLog.findOneAndUpdate(
      {
        userId: req.userId,
        goalId: id,
        date: logDate
      },
      logData,
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    // Update goal's current value
    goal.currentValue = actualValue;
    if (sleepStartTime) goal.sleepStartTime = sleepStartTime;
    if (sleepEndTime) goal.sleepEndTime = sleepEndTime;
    await goal.save();

    // Audit log
    await createAuditLog(req.userId, 'goal_logged', {
      targetResource: 'GoalLog',
      targetId: log._id
    });

    res.status(201).json({
      success: true,
      message: 'Goal progress logged successfully',
      data: { log, goal }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get goal progress logs
// @route   GET /api/goals/:id/logs
// @access  Private
export const getGoalLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Verify goal exists and belongs to user
    const goal = await WellnessGoal.findOne({ _id: id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Goal not found' 
      });
    }

    const filter = { userId: req.userId, goalId: id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const logs = await GoalLog.find(filter).sort({ date: -1 });

    res.json({
      success: true,
      data: { 
        goal,
        logs 
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get goal progress dashboard
// @route   GET /api/goals/dashboard
// @access  Private
export const getGoalDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get active goals
    const activeGoals = await WellnessGoal.find({ 
      userId: req.userId, 
      isActive: true 
    });

    // Get today's logs
    const todayLogs = await GoalLog.find({
      userId: req.userId,
      date: today
    }).populate('goalId');

    // Calculate progress for each goal
    const goalsWithProgress = await Promise.all(
      activeGoals.map(async (goal) => {
        const todayLog = todayLogs.find(
          log => log.goalId && log.goalId._id.toString() === goal._id.toString()
        );

        // Get last 7 days logs for trend
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentLogs = await GoalLog.find({
          userId: req.userId,
          goalId: goal._id,
          date: { $gte: sevenDaysAgo }
        }).sort({ date: -1 });

        const currentValue = goal.currentValue || (todayLog ? todayLog.actualValue : 0);
        const percentage = Math.min(Math.round((currentValue / goal.targetValue) * 100), 100);

        // Format response based on goal type
        const response = {
          _id: goal._id,
          goalType: goal.goalType,
          targetValue: goal.targetValue,
          currentValue: currentValue,
          unit: goal.unit,
          percentage: percentage,
          description: goal.description
        };

        // Add specific data for each goal type
        if (goal.goalType === 'steps') {
          response.steps = {
            current: currentValue,
            target: goal.targetValue,
            percentage: percentage
          };
        } else if (goal.goalType === 'active_time') {
          response.activeTime = {
            minutes: currentValue,
            calories: todayLog?.calories || 0,
            distance: todayLog?.distance || 0
          };
        } else if (goal.goalType === 'sleep') {
          // Calculate sleep duration
          const sleepHours = Math.floor(currentValue / 60);
          const sleepMinutes = currentValue % 60;
          
          response.sleep = {
            hours: sleepHours,
            minutes: sleepMinutes,
            startTime: goal.sleepStartTime || todayLog?.sleepStartTime || '',
            endTime: goal.sleepEndTime || todayLog?.sleepEndTime || '',
            quality: todayLog?.sleepQuality || 'good'
          };
        }

        response.recentLogs = recentLogs;
        response.hasLoggedToday = !!todayLog;

        return response;
      })
    );

    // Organize by goal type for easier frontend consumption
    const organizedGoals = {
      steps: goalsWithProgress.find(g => g.goalType === 'steps') || null,
      activeTime: goalsWithProgress.find(g => g.goalType === 'active_time') || null,
      sleep: goalsWithProgress.find(g => g.goalType === 'sleep') || null,
      other: goalsWithProgress.filter(g => !['steps', 'active_time', 'sleep'].includes(g.goalType))
    };

    res.json({
      success: true,
      data: {
        goals: organizedGoals,
        allGoals: goalsWithProgress,
        summary: {
          totalActiveGoals: activeGoals.length,
          goalsLoggedToday: todayLogs.length,
          goalsAchievedToday: todayLogs.filter(
            log => {
              const goal = activeGoals.find(g => g._id.toString() === log.goalId._id.toString());
              return goal && log.actualValue >= goal.targetValue;
            }
          ).length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
