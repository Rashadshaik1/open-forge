import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { parseRollNumber } from '../utils/parseRollNumber.js';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, college email, password, and roll number.',
      });
    }

    // Verify email domain is @gvpce.ac.in
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@gvpce.ac.in')) {
      return res.status(400).json({
        success: false,
        message: 'Registration is restricted to @gvpce.ac.in email addresses only.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Auto-parse department & year from the roll number
    const parsedData = parseRollNumber(rollNumber);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      rollNumber: parsedData.rollNumber,
      department: parsedData.department,
      year: parsedData.currentYear,
      role: 'student', // All public signups default to student
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration error: ' + error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact an Open Forge admin.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error: ' + error.message,
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Requires Bearer token)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile: ' + error.message,
    });
  }
};