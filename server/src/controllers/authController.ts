import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { UserModel as User } from '@/models/User.js';
import { getSecret } from '@/utils/secrets.js';
import { UserStatusEnum, UserTypeEnum } from '@by-trail/shared';
import { AuthRequest } from '@/types/server_only.js';

let JWT_SECRET;
try {
  JWT_SECRET = getSecret('JWT_SECRET', 'JWT_SECRET');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const jwtTokenExpiry = '24h';

// --- REGISTER LOGIC ---
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, favRegions } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required fields' });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: 'Please provide a valid email address' });
    }

    // 3. Validate password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 5. Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create new User with your specific schema fields
    const newUser = new User({
      name,
      email: validator.normalizeEmail(email), // Normalize email
      password: hashedPassword,
      favRegions: favRegions || [], // Optional
      status: UserStatusEnum.ACTIVE, // Default status
      type: UserTypeEnum.USER, // Default type
    });

    // 7. Save user to database
    const savedUser = await newUser.save();
    if (!savedUser)
      return res.status(500).json({ message: 'Error saving user to database' });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// --- LOGIN LOGIC ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly select the password field
    // This is crucial if your schema has { select: false } on password
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // --- DEFENSIVE CHECK ---
    // Prevents server crash (500) if the user record is corrupted (missing password)
    if (!user.password) {
      console.error(`Error: User ${email} has no password field in DB.`);
      return res.status(400).json({
        message:
          'There was a problem with your account. Please contact support at support@example.com.',
      });
    }

    // 2. Check if user is banned
    if (user.status === UserStatusEnum.BANNED) {
      return res.status(403).json({
        message: 'Your account has been banned. Please contact support.',
      });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // 4. Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: jwtTokenExpiry,
    });

    // 5. Send response
    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    // Fetch only the password field from the user document
    const user = await User.findById(userId).select('+password').exec();
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // --- DEFENSIVE CHECK ---
    // Prevents server crash (500) if the user record is corrupted (missing password)
    if (!user.password) {
      console.error(`Error: User ${userId} has no password field in DB.`);
      return res.status(400).json({
        error:
          'There was a problem with your account. Please contact support at support@example.com.',
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Delete user account
    const result = await User.deleteOne({ _id: userId }).exec();
    if (result.deletedCount === 1) res.status(204).json();
    else res.status(500).json({ error: 'Error deleting account' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ error: 'Server error during account deletion' });
  }
};
