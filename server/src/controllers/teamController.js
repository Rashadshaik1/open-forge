import mongoose from 'mongoose';
import User from '../models/User.js';

// @desc    Get categorized team list (Public display)
// @route   GET /api/team
// @access  Public
export const getTeam = async (req, res) => {
  try {
    const faculty = [
      {
        name: 'Faculty Coordinator',
        designation: 'Assistant Professor, Dept of IT',
        department: 'Information Technology',
        role: 'Faculty Advisor',
      },
    ];

    const board = await User.find({ role: { $in: ['board', 'admin'] } })
      .select('name rollNumber department year role avatar photoUrl designation linkedin github email')
      .sort({ name: 1 });

    const volunteers = await User.find({ role: 'volunteer' })
      .select('name rollNumber department year role avatar photoUrl designation linkedin github email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        faculty,
        board,
        volunteers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for Admin role management (Students, Volunteers, Board)
// @route   GET /api/team/all-members
// @access  Private (Admin only)
export const getAllMembers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members: ' + error.message,
    });
  }
};

// @desc    Promote or update member role & designation & photo
// @route   PATCH /api/team/role/:id
// @access  Private (Admin only)
export const updateMemberRole = async (req, res) => {
  try {
    const { role, designation, avatar, photoUrl, linkedin, rollNumber } = req.body;
    const { id } = req.params;

    let user = null;

    // 1. Only perform findById if 'id' is a valid 24-character hexadecimal ObjectId
    if (id && id !== 'undefined' && id !== 'null' && mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    }

    // 2. If not a valid ObjectId or not found, query by rollNumber
    if (!user) {
      const searchRoll = (rollNumber || id)?.trim().toUpperCase();
      if (searchRoll) {
        user = await User.findOne({ rollNumber: searchRoll });
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${id || rollNumber}" not found in database.`,
      });
    }

    // 3. Apply profile updates
    if (role) user.role = role;
    if (designation !== undefined) user.designation = designation;
    if (avatar || photoUrl) {
      user.avatar = avatar || photoUrl;
      user.photoUrl = photoUrl || avatar;
    }
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Profile and role updated for ${user.name}.`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile: ' + error.message,
    });
  }
};