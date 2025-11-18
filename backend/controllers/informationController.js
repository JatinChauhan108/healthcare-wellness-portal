import Information from '../models/mongodb/Information.js';

// Get all published information
export const getAllInformation = async (req, res) => {
  try {
    const information = await Information.find({ isPublished: true })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: information.length,
      data: information
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching information',
      error: error.message
    });
  }
};

// Get information by category
export const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const information = await Information.find({
      category,
      isPublished: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: information.length,
      data: information
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching information by category',
      error: error.message
    });
  }
};

// Get single information by ID
export const getInformationById = async (req, res) => {
  try {
    const { id } = req.params;
    const information = await Information.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found'
      });
    }

    res.status(200).json({
      success: true,
      data: information
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching information',
      error: error.message
    });
  }
};

// Create new information (Admin only)
export const createInformation = async (req, res) => {
  try {
    const { category, title, excerpt, content, imageUrl } = req.body;

    if (!category || !title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newInformation = new Information({
      category,
      title,
      excerpt,
      content,
      imageUrl
    });

    await newInformation.save();

    res.status(201).json({
      success: true,
      message: 'Information created successfully',
      data: newInformation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating information',
      error: error.message
    });
  }
};

// Update information (Admin only)
export const updateInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const information = await Information.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Information updated successfully',
      data: information
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating information',
      error: error.message
    });
  }
};

// Delete information (Admin only)
export const deleteInformation = async (req, res) => {
  try {
    const { id } = req.params;

    const information = await Information.findByIdAndDelete(id);

    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Information deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting information',
      error: error.message
    });
  }
};
