import mongoose from 'mongoose';
import User from '../models/User.js';

// Leadership hierarchy dictionary for board ordering
const BOARD_ROLE_PRIORITY = {
  'president': 1,
  'secretary': 2,
  'treasurer': 3,
  'technical lead': 4,
  'tech lead': 4,
  'designing lead': 5,
  'design lead': 5,
  'events manager': 6,
  'event manager': 6,
  'documentation lead': 7,
  'docs lead': 7,
  'social media lead': 8,
};

const getBoardRank = (member) => {
  const designation = (member.designation || '').toLowerCase().trim();
  for (const [key, rank] of Object.entries(BOARD_ROLE_PRIORITY)) {
    if (designation.includes(key)) {
      return rank;
    }
  }
  return 99; // Fallback for members without recognized priority designations
};

// @desc    Get categorized team list (Public display)
// @route   GET /api/team
// @access  Public
export const getTeam = async (req, res) => {
  try {
    const faculty = [
      {
        _id: 'fac-1',
        name: 'Dr. B. Jaya Lakshmi',
        designation: 'Associate Professor & Head of Department',
        department: 'Department of Information Technology',
        message: 'Empowering students to innovate, architect scalable technologies, and lead with technical integrity.',
        photoUrl: 'jaya.jpg',
        linkedin: 'https://www.linkedin.com/in/',
      },
      {
        _id: 'fac-2',
        name: 'Mr. Srinu Bevara',
        designation: 'Assistant Professor & Network Admin',
        department: 'Department of Information Technology',
        message: 'Fostering hands-on systems development, competitive programming, and collaborative open-source engineering.',
        photoUrl: 'SRINU B.jpg',
        linkedin: 'https://www.linkedin.com/in/',
      },
    ];

    const rawBoard = await User.find({ role: { $in: ['board', 'admin'] } })
      .select('name rollNumber department year role avatar photoUrl designation linkedin github email')
      .lean();

    // Hierarchical ranking sort: President -> Secretary -> Treasurer -> ... -> Social Media Lead
    const board = rawBoard.sort((a, b) => {
      const rankA = getBoardRank(a);
      const rankB = getBoardRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Volunteers sorted strictly in ascending numeric order by rollNumber
    const volunteers = await User.find({ role: 'volunteer' })
      .select('name rollNumber department year role avatar photoUrl designation linkedin github email')
      .collation({ locale: 'en', numericOrdering: true })
      .sort({ rollNumber: 1 });

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
    if (avatar !== undefined || photoUrl !== undefined) {
      user.avatar = avatar ?? photoUrl;
      user.photoUrl = photoUrl ?? avatar;
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