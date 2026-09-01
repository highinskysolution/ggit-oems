import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'oems_academic_jwt_secret_key_2026_se_project',
    { expiresIn: '30d' }
  );
};

// Valid Academic Departments and Years
const VALID_DEPARTMENTS = ['BCA', 'BSc IT', 'AI'];
const VALID_YEARS = ['FY', 'SY', 'TY'];
const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY || 'GGIT-ADMIN-2026';

// @desc    Register new student candidate (Public Registration is strictly for students)
// @route   POST /api/auth/register
// @access  Public (Students Only)
export const register = async (req, res) => {
  try {
    let { name, email, password, roll_no, department, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, and Password).',
      });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    // Validate Department
    if (!department || !VALID_DEPARTMENTS.includes(department)) {
      department = 'BCA';
    }

    // Validate Year for Students
    if (!year || !VALID_YEARS.includes(year)) {
      year = 'FY';
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: `An account with email '${email}' is already registered in GGIT.`,
      });
    }

    // Validate & Check Roll Number for Students
    if (!roll_no || !roll_no.trim()) {
      return res.status(400).json({
        success: false,
        message: 'University Roll Number is mandatory for student candidate registration.',
      });
    }

    roll_no = roll_no.trim().toUpperCase();

    // Roll Number format limitation (alphanumeric, 4 to 15 characters)
    const rollRegex = /^[A-Z0-9_-]{4,15}$/;
    if (!rollRegex.test(roll_no)) {
      return res.status(400).json({
        success: false,
        message: 'Roll Number must be between 4 to 15 alphanumeric characters (e.g. BCA2024001, BSCIT2401, AI202410).',
      });
    }

    // Check for exact duplicate roll number (no repetition allowed)
    const rollExists = await User.findOne({ roll_no });
    if (rollExists) {
      return res.status(400).json({
        success: false,
        message: `Roll Number '${roll_no}' is already assigned to another student in GGIT. Duplicate roll numbers are not permitted.`,
      });
    }

    // Create new student user in MongoDB
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      roll_no,
      department,
      year,
      last_login: new Date(),
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to GGIT Candidate Portal.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roll_no: user.roll_no,
        department: user.department,
        year: user.year,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.roll_no) {
        return res.status(400).json({
          success: false,
          message: 'This Roll Number is already registered in GGIT.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'A user with this email or roll number already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Admin creates and authorizes new Faculty / Teacher Account
// @route   POST /api/auth/faculty
// @access  Private (Admin only)
export const createFacultyAccount = async (req, res) => {
  try {
    let { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Name, Email, and Temporary Password for the faculty member.',
      });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    if (!department || !VALID_DEPARTMENTS.includes(department)) {
      department = 'BCA';
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: `An account with email '${email}' already exists in GGIT.`,
      });
    }

    const faculty = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      department,
      year: 'N/A',
      last_login: null,
    });

    return res.status(201).json({
      success: true,
      message: `Faculty account for ${faculty.name} authorized successfully!`,
      faculty: {
        _id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
        department: faculty.department,
      },
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create faculty account.',
    });
  }
};

// @desc    Login student or faculty user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    email = email.toLowerCase().trim();

    let user = await User.findOne({ email });

    // Faculty alias fallback (support all common variations for Dr. Lt. Mrunali Sawant)
    const facultyAliases = ['mrunalisawant@gmail.com', 'sawantmurnali@gmail.com', 'sawantmuranali@gmail.com'];
    if (!user && facultyAliases.includes(email)) {
      user = await User.findOne({ email: { $in: facultyAliases } });
      // If none of the faculty aliases exist in DB yet, auto-provision
      if (!user) {
        user = await User.create({
          name: 'Dr. Lt. MRUNALI SAWANT',
          email,
          password: '123456',
          role: 'teacher',
          department: 'BCA',
          year: 'N/A',
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // If an admin attempts standard login without admin key, guide to secure admin gateway
    if (user.role === 'admin' && !req.body.admin_key) {
      return res.status(403).json({
        success: false,
        requiresAdminKey: true,
        message: 'Administrator authorization requires a valid GGIT Admin Master Key.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify Admin Key if role is admin
    if (user.role === 'admin') {
      if (req.body.admin_key !== ADMIN_MASTER_KEY) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Admin Master Key. Access Denied.',
        });
      }
    }

    // Update last login timestamp
    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roll_no: user.roll_no,
        department: user.department,
        year: user.year,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Dedicated Secret Admin Login Gateway with Master Key
// @route   POST /api/auth/admin-login
// @access  Public (Protected by Admin Key)
export const adminLogin = async (req, res) => {
  try {
    const { email, password, admin_key } = req.body;

    if (!email || !password || !admin_key) {
      return res.status(400).json({
        success: false,
        message: 'Email, Password, and Admin Master Key are strictly required.',
      });
    }

    if (admin_key.trim() !== ADMIN_MASTER_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Admin Master Key. Security Alert Logged.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No administrator account found with this email.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator password.',
      });
    }

    // Update last login timestamp
    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Administrator session unlocked successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login.',
    });
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
    });
  }
};

// @desc    Get all users who have logged in / registered (Admin Exclusive Audit)
// @route   GET /api/auth/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, department } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;

    // Fetch all users sorted by most recently active / logged in
    const users = await User.find(filter)
      .select('name email role roll_no department year last_login createdAt')
      .sort({ last_login: -1, createdAt: -1 });

    const totalStudents = users.filter((u) => u.role === 'student').length;
    const totalTeachers = users.filter((u) => u.role === 'teacher').length;

    return res.status(200).json({
      success: true,
      count: users.length,
      stats: {
        totalUsers: users.length,
        totalStudents,
        totalTeachers,
      },
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user access logs.',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { name, department, year, currentPassword, newPassword } = req.body;
    if (name) user.name = name.trim();
    if (department) user.department = department;
    if (year && user.role === 'student') user.year = year;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password.',
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.',
        });
      }
      user.password = newPassword;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roll_no: user.roll_no,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete own administrator account.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User account removed from system log.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
    });
  }
};
