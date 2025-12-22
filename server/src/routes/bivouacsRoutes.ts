import express from 'express';
import { fetchBivouacs } from '../controllers/bivouacsController.ts';

const router = express.Router();

router.post('/list', fetchBivouacs)

export default router;
