import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { parseRollNumber } from '../utils/parseRollNumber.js';

// @desc    Initiate password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate secure 32-byte reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store expiration in user record (valid for 1 hour)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Client reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Configure SMTP transport using your .env credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Open Forge" <noreply@openforge.club>',
      to: user.email,
      subject: 'OpenForge Account: Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 16px;">
          <h2 style="color: #E53E24; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Hello <strong>${user.name}</strong>,
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            We received a request to reset your OpenForge portal password. Click the button below to set a new password. This link will expire in 60 minutes.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #E53E24; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: bold; text-decoration: none; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
            If you did not make this request, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #f3f4f6; margin-top: 24px;" />
          <p style="color: #9ca3af; font-size: 11px;">
            Department of Information Technology, Gayatri Vidya Parishad College of Engineering (Autonomous)
          </p>
        </div>
      `,
    };

    // If mail credentials are not configured, log link for local testing
    if (
      !process.env.EMAIL_USER ||
      process.env.EMAIL_USER === 'your_email@gmail.com'
    ) {
      console.log('--- [DEV MODE] EMAIL CREDENTIALS NOT CONFIGURED ---');
      console.log(`Password reset link for ${user.email}: ${resetUrl}`);
      console.log('----------------------------------------------------');

      return res.status(200).json({
        success: true,
        message: 'Password reset link generated (Logged to server console in dev mode).',
      });
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent! Check your inbox.',
    });
  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent. Please check server configuration.',
    });
  }
};

// @desc    Reset user password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      console.log('[RESET FAILED]: Password is missing or less than 6 characters.');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (!token) {
      console.log('[RESET FAILED]: Token parameter is missing from route.');
      return res.status(400).json({
        success: false,
        message: 'Reset token is required.',
      });
    }

    // Hash token to compare against hashed value in DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token.trim())
      .digest('hex');

    console.log('[RESET ATTEMPT] Param token:', token);
    console.log('[RESET ATTEMPT] Hashed query token:', resetPasswordToken);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      // Diagnostic check: check if the token exists but has expired
      const userExpired = await User.findOne({ resetPasswordToken });
      if (userExpired) {
        console.log(`[RESET FAILED]: Token exists for ${userExpired.email} but has expired.`);
        return res.status(400).json({
          success: false,
          message: 'Password reset link has expired. Please request a new one.',
        });
      }

      console.log('[RESET FAILED]: No user found matching the provided token hash.');
      return res.status(400).json({
        success: false,
        message: 'Invalid password reset link. Please request a fresh reset link.',
      });
    }

    // Set new plain password; the schema's pre('save') hook handles hashing
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`[RESET SUCCESS]: Password updated successfully for ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password: ' + error.message,
    });
  }
};

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
      role: 'student',
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