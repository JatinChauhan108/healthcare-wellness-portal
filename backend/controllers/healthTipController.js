import HealthTip from '../models/HealthTip.js';

// @desc    Get health tips
// @route   GET /api/health-tips
// @access  Public
export const getHealthTips = async (req, res, next) => {
  try {
    const { category, random } = req.query;
    
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }

    let tips;
    if (random === 'true') {
      // Get random tip
      const count = await HealthTip.countDocuments(filter);
      const randomIndex = Math.floor(Math.random() * count);
      tips = await HealthTip.find(filter)
        .limit(1)
        .skip(randomIndex);
    } else {
      tips = await HealthTip.find(filter)
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.json({
      success: true,
      data: { tips }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create health tip
// @route   POST /api/health-tips
// @access  Private (Provider only)
export const createHealthTip = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const tip = new HealthTip({
      title,
      content,
      category,
      createdBy: req.userId
    });

    await tip.save();

    res.status(201).json({
      success: true,
      message: 'Health tip created successfully',
      data: { tip }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update health tip
// @route   PUT /api/health-tips/:id
// @access  Private (Provider only)
export const updateHealthTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tip = await HealthTip.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!tip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Health tip not found' 
      });
    }

    res.json({
      success: true,
      message: 'Health tip updated successfully',
      data: { tip }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete health tip
// @route   DELETE /api/health-tips/:id
// @access  Private (Provider only)
export const deleteHealthTip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tip = await HealthTip.findByIdAndDelete(id);

    if (!tip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Health tip not found' 
      });
    }

    res.json({
      success: true,
      message: 'Health tip deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get health tip of the day
// @route   GET /api/health-tips/daily
// @access  Public
export const getDailyTip = async (req, res, next) => {
  try {
    // Use current date as seed for consistent daily tip
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );

    const count = await HealthTip.countDocuments({ isActive: true });
    const index = dayOfYear % count;

    const tip = await HealthTip.findOne({ isActive: true })
      .skip(index)
      .limit(1);

    res.json({
      success: true,
      data: { tip }
    });
  } catch (error) {
    next(error);
  }
};
