import jwt from 'jsonwebtoken';
import { User } from '../models/models.js';
import { getSecret } from '../utils/secrets.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if header Authorization is present and starts with "Bearer"
    // Standard format: "Bearer <token_string>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Take only the token (remove "Bearer " prefix)
            token = req.headers.authorization.split(' ')[1];

            // 3. Retrieve the secret 
            // Note: Must be the same used to sign the token during login
            const JWT_SECRET = getSecret('JWT_SECRET', 'JWT_SECRET');

            // 4. Verify token validity
            const decoded = jwt.verify(token, JWT_SECRET);

            // 5. Serch the user in the DB (without the password field)
            // Fundamental to check if user still exists
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'User not found / Token invalid' });
            }

            // 6. Check if user is banned
            if (req.user.status === 'banned') {
                return res.status(403).json({ message: 'User is banned' });
            }

            // 7. If all good, proceed to next middleware/controller
            next();

        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};