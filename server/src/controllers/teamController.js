import User from '../models/User.js';

// @desc Get categorized team list (Faculty, Board, Volunteers)
// @route GET /api/team
// @access Public
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
      .select('name rollNumber department year role')
      .sort({ name: 1 });

    const volunteers = await User.find({ role: 'volunteer' })
      .select('name rollNumber department year role')
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