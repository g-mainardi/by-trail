import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new User with your specific schema fields
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            favRegions: favRegions || [], // Optional
            status: 'active' // Default status
        });

        await newUser.save();

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
            return res.status(403).json({ message: 'Your account has been suspended.' });
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