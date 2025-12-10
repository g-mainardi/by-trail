import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { User } from '../models/models.js';
import { getSecret } from '../utils/secrets.js';

let JWT_SECRET;
try {
    JWT_SECRET = getSecret('JWT_SECRET', 'JWT_SECRET');
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

// --- REGISTER LOGIC ---
export const signup = async (req, res) => {
    try {
        const { name, email, password, favRegions } = req.body;

        // 1. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // 2. Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // 3. Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        })) {
            return res.status(400).json({
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
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
            status: 'active' // Default status
        });

        // 7. Save user to database
        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.status(500).json({ message: 'Error saving user to database' });
        }
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

// --- LOGIN LOGIC ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check if user is banned
        if (user.status === 'banned') {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        // 3. Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Send response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                favRegions: user.favRegions
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const deleteAccount = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Delete user account
        await User.deleteOne({ _id: user._id });

        res.json({ message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ message: 'Server error during account deletion' });
    }
}