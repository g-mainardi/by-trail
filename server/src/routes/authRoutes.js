import express from 'express';
import { signup, login } from '../controllers/authController.js'; 

const router = express.Router();

// Define endpoints
router.post('/signup', signup);
router.post('/login', login);

export default router;