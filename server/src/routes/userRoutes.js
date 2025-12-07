import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/profile
// Protected route
router.get('/profile', protect, (req, res) => {
    res.json({
        message: `Hi ${req.user.name}, welcome to the reserved area!`,
        userData: req.user
    });
});

export default router;